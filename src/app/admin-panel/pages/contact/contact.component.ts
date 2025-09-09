import { ContactService } from './../../../admin-panel/pages/contact/service/contact.service';
import { CommonModule } from '@angular/common';

import { Component } from '@angular/core';
import { DataTableComponent } from '../../../core/components/data-table/data-table.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule , DataTableComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  tableConfig = {
    title: 'Contact List',
  }
  totalCount!:number;
  tableData:any[]=[];
  isLoading:boolean=false;

  tableSettings = {
  columns: {
    id: {
      title: '#',
      type: 'id',
    },
    name: {
      title: 'Name',
      type: 'string',
    },
    email: {
      title: 'Email',
      type: 'string',
    },
    phone: {
      title: 'Phone',
      type: 'string',
    },
    createdAt: {
      title: 'Created At',
      type: 'string',
    },
  }
}

 constructor(
  private _contactService : ContactService
 ){}

  ngOnInit(): void {
    console.log('Admin Products Component Initialized');

    this.getcontact();
  }

  getcontact(params?:any) {
    this.isLoading = true;
    const defparams = {
        page : 1,
        limit : 10,
        search : ''
    }
    // this._customer.customerlist(params ?? defparams).subscribe(
    //   (response:any) => {
    //     this.tableData = response?.data;
    //     this.totalCount = response?.total;
    //     this.isLoading = false;
    //   }
    // );
    this._contactService.contactList(params ?? defparams).subscribe(
      (response:any) => {
        this.tableData = response?.data;
        this.totalCount = response?.total;
        this.isLoading = false;
      });
  }


  tableEvent(env:any){
    if(env?.type === 'apievent'){
      this.getcontact(env?.event)
    }
  }
}
