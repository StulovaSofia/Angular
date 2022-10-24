import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../services/api.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})

export class DialogComponent implements OnInit {
  personForm !: FormGroup;
  actionBtn: string = 'Save'

  email = new FormControl('', [Validators.required, Validators.email]);


  constructor(private formBuilder: FormBuilder,
              private api: ApiService,
              @Inject(MAT_DIALOG_DATA) public editDate: any,
              private dialogRef: MatDialogRef<DialogComponent>) {
  }

  ngOnInit(): void {
    this.personForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required]
    });
    if (this.editDate) {
      this.actionBtn = 'Update'
      this.personForm.controls['firstName'].setValue(this.editDate.firstName);
      this.personForm.controls['lastName'].setValue(this.editDate.lastName);
      this.personForm.controls['email'].setValue(this.editDate.email);
      this.personForm.controls['age'].setValue(this.editDate.age);
      this.personForm.controls['gender'].setValue(this.editDate.gender);
    }
  }

  updatePerson() {
    if (this.personForm.valid) {
      this.api.putPerson(this.personForm.value, this.editDate.id)
        .subscribe({
          next: (res) => {
            this.personForm.reset();
            this.dialogRef.close('save');
          },
          error: () => {
            console.log("Error while updating person")
          }
        });
    } else {
      console.log("Not all fields are filled")
    }
  }

  addPerson() {
    if (!this.editDate) {
      if (this.personForm.valid) {
        this.api.postPerson(this.personForm.value)
          .subscribe({
            next: (res) => {
              this.personForm.reset();
              this.dialogRef.close('save');
            },
            error: () => {
              console.log("Error while adding person")
            }
          });
      } else {
        this.updatePerson()
      }
    } else {
      this.updatePerson()
    }
  }
}

