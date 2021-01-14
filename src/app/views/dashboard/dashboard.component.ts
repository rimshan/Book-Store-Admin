import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UsersService } from "../../Services/apiServices/users.service";
import { GlobleService } from "../../Services/globle.service";
import { TokenStorage } from "../../shared/auth/token-storage";
import { ModalDirective } from "ngx-bootstrap/modal";
//import { HttpClient } from '@angular/common/http';
import { Subject } from "rxjs";
import { DataTableDirective } from "angular-datatables";

import { User } from "../../models/user.model";

@Component({
  templateUrl: "dashboard.component.html",
})
export class DashboardComponent implements OnDestroy, OnInit {
  @ViewChild("infoModal") public infoModal: ModalDirective;
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;

  constructor(
    public route: Router,
    private usersService: UsersService,
    private token: TokenStorage,
    private globalService: GlobleService,
    private formBuilder: FormBuilder
  ) {}

  dtOptions: DataTables.Settings = {};

  updateUserForm: FormGroup;
  submitted = false;
  public userss: any;
  public users: Array<any> = [];
  user: User;
  message: any;
  // We use this trigger because fetching the list of persons can be quite long,
  // thus we ensure the data is fetched before rendering
  dtTrigger: Subject<any> = new Subject<any>();

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: "simple_numbers",
      pageLength: 10,
      paging: true,
      destroy: true,
    };
    this.getUsers();
    this.updateUserForm = this.formBuilder.group({
      id: ["", [Validators.required]],
      is_active: ["", [Validators.required]],
      first_name: ["", [Validators.required]],
      last_name: ["", [Validators.required]],
      email: ["", [Validators.required]],
      contact_number: ["", [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  get f() {
    return this.updateUserForm.controls;
  }

  getUsers(): void {
    this.usersService.getUsers().subscribe(
      (data) => {
        this.userss = data;
        this.users = this.userss.data;
        this.dtOptions = {
          pagingType: "simple_numbers",
          pageLength: 10,
          paging: true,
          destroy: true,
        };
        this.rerender();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  handleStatusChange(event: any) {
    this.updateUserForm.controls["is_active"].setValue(event.target.checked);
  }

  onEditClick(user) {
    this.infoModal.show();
    this.updateUserForm.controls["id"].setValue(user.id);
    this.updateUserForm.controls["is_active"].setValue(user.is_active);
    this.updateUserForm.controls["first_name"].setValue(user.first_name);
    this.updateUserForm.controls["last_name"].setValue(user.last_name);
    this.updateUserForm.controls["contact_number"].setValue(
      user.contact_number
    );
    this.updateUserForm.controls["email"].setValue(user.email);
  }

  onHideModal() {
    this.user = new User();
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.updateUserForm.invalid) {
      return;
    }
    this.usersService
      .updateUser(this.updateUserForm.value, this.updateUserForm.value.id)
      .subscribe(
        (data) => {
          this.message = data;
          if (this.message.message) {
            this.globalService.getSuccessNotifyOptions(this.message.message);
            this.infoModal.hide();
            this.getUsers();
          }
        },
        (error) => {
          this.globalService.getErrorNotifyLogin(
            "Somthing went wrong please try again"
          );
        }
      );
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
