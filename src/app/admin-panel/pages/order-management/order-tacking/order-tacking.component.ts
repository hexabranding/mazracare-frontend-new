import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  stagger,
} from '@angular/animations';
import { OrderService } from '../service/order.service';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-tacking.component.html',
  styleUrls: ['./order-tacking.component.scss'],
  animations: [
    // expand/collapse the panel (height) — content inside is horizontal
    trigger('panelHeight', [
      state('closed', style({ height: '0px', opacity: 0, padding: '0 16px' })),
      state('open', style({ height: '*', opacity: 1, padding: '12px 16px' })),
      transition('closed <=> open', animate('320ms cubic-bezier(.2,.8,.2,1)')),
    ]),
    // stagger the steps when panel opens
    trigger('staggerSteps', [
      transition('void => *', []),
      transition('closed => open', [
        query(
          '.step',
          [
            style({ opacity: 0, transform: 'translateY(6px)' }),
            stagger(60, animate('260ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class OrderTackingComponent implements OnInit {

  constructor( private orderService:OrderService) { }

// apiResponse: any = {
//     "success": true,
//     "currentPage": 1,
//     "totalPages": 1,
//     "totalOrders": 3,
//     "data": [
//       {
//         "shippingAddress": {
//           "fullName": "Amritha Ramadas",
//           "country": "United Arab Emirates",
//           "company": "abc",
//           "email": "amrithachaithram@gmail.com",
//           "addressLine1": "25 Street,Khalifa City A,Villa No 4",
//           "addressLine2": "Courtyard RoadNear Infopark",
//           "city": "Kochi",
//           "state": "أبو ظبي",
//           "pincode": "0000000"
//         },
//         "_id": "68f78d8be788e08484a6b09d",
//         "user": "68bc0852090d36d4b28e9bc6",
//         "orderItems": [
//           {
//             "product": "68bfce213f3f8b7a20d86413",
//             "quantity": 1,
//             "price": 36150,
//             "_id": "68f78d8be788e08484a6b09e"
//           }
//         ],
//         "totalPrice": 36150,
//         "paymentMethod": "CashOnDelivery",
//         "paymentStatus": "Pending",
//         "orderStatus": "Processing",
//         "orderedAt": "2025-10-21T13:41:31.820Z",
//         "createdAt": "2025-10-21T13:41:31.821Z",
//         "updatedAt": "2025-10-21T13:41:31.821Z",
//         "__v": 0
//       },
//       {
//         "shippingAddress": {
//           "fullName": "Amritha Ramadas",
//           "country": "United Arab Emirates",
//           "company": "abc",
//           "email": "amrithachaithram@gmail.com",
//           "addressLine1": "25 Street,Khalifa City A,Villa No 4",
//           "addressLine2": "Courtyard RoadNear Infopark",
//           "city": "Kochi",
//           "state": "أبو ظبي",
//           "pincode": "682030"
//         },
//         "_id": "68ef679c27bfc0344e32d464",
//         "user": "68bc0852090d36d4b28e9bc6",
//         "orderItems": [
//           {
//             "product": "68c120d68bd88cd18b5b776c",
//             "quantity": 3,
//             "price": 38450,
//             "_id": "68ef679c27bfc0344e32d465"
//           },
//           {
//             "product": "68c1064d8bd88cd18b5b72d3",
//             "quantity": 2,
//             "price": 40300,
//             "_id": "68ef679c27bfc0344e32d466"
//           }
//         ],
//         "totalPrice": 195950,
//         "paymentMethod": "CashOnDelivery",
//         "paymentStatus": "Pending",
//         "orderStatus": "Processing",
//         "orderedAt": "2025-10-15T09:21:32.906Z",
//         "createdAt": "2025-10-15T09:21:32.907Z",
//         "updatedAt": "2025-10-15T09:21:32.907Z",
//         "__v": 0
//       },
//       {
//         "shippingAddress": {
//           "fullName": "dsfgdfs sdfgdfs",
//           "country": "dsfgsdf",
//           "company": "sdfgsdf",
//           "email": "sdfgds@gmail.com",
//           "addressLine1": "dsfgdfsg",
//           "addressLine2": "sdfgdfs",
//           "city": "dsfgfds",
//           "state": "dsfgdfs",
//           "pincode": "676541"
//         },
//         "_id": "68c05b2f3f3f8b7a20d87876",
//         "user": "68bc0852090d36d4b28e9bc6",
//         "orderItems": [
//           {
//             "product": "68bff7d13f3f8b7a20d86bb9",
//             "quantity": 1,
//             "price": 29600,
//             "_id": "68c05b2f3f3f8b7a20d87877"
//           }
//         ],
//         "totalPrice": 29600,
//         "paymentMethod": "CashOnDelivery",
//         "paymentStatus": "Pending",
//         "orderStatus": "Processing",
//         "orderedAt": "2025-09-09T16:51:59.797Z",
//         "createdAt": "2025-09-09T16:51:59.799Z",
//         "updatedAt": "2025-09-09T16:51:59.799Z",
//         "__v": 0
//       }
//     ]
//   };

  orders: any[] = [];
  totalOrders = 0;
  stepKeys = ['Order Placed', 'Pending', 'Processing', 'preparing' , 'packed', 'Dispatched' , 'Delivered' ]

  ngOnInit() {
    // Process API Response
    // this.totalOrders = this.apiResponse.totalOrders;

    // // Map data to include 'isOpen' state
    // this.orders = this.apiResponse.data.map((order: any, index: number) => ({
    //   ...order,
    //   // Default first order to open, others closed
    //   isOpen: index === 0
    // }));
    this.getOrders();
  }

  getOrders() {
    this.orderService.getOrderUserId().subscribe({
      next:(res:any)=>{
        if(!res.success) return;
        this.totalOrders = res.totalOrders;
        this.orders = (res?.data || []).map((order: any, index: number) => ({
          ...order,
          // Default first order to open, others closed
          isOpen: index === 0
        }));
      }
    });
  }

  toggleOrder(order: any) {
  console.log('Toggling order:', order);
  if(order.orderStatus === 'Cancelled') return;
    const wasOpen = order.isOpen;
    // Close ALL orders
    this.orders.forEach(o => o.isOpen = false);

    // If the clicked one was closed, open it now.
    if (!wasOpen) {
      order.isOpen = true;
    }
  }

  statusIndex(status: string | undefined): number {
    if (!status) return 0;
    const s = status.toLowerCase();
    const map: Record<string, number> = {
      // 'order placed': 0, 'placed': 0, 'ordered': 0,
      // 'processing': 1, 'preparing': 1, 'packed': 1,
      // 'shipped': 2,
      // 'out for delivery': 3,
      // 'delivered': 4, 'completed': 4
      'order placed': 0 , 'pending': 1 , 'processing': 2, 'preparing': 3 , 'packed': 4, 'dispatched': 5 , 'delivered': 6
    };
    return map[s] ?? 0;
  }

  getConnectorFill(order: any, i: number): number {
    console.log(order , i);

    const currentIdx = this.statusIndex(order.orderStatus);
    if (i < currentIdx - 1) return 100;
    if (i === currentIdx - 1) return 100;
    return 0;
  }

  getStepClass(order: any, i: number) {
    const idx = this.statusIndex(order.orderStatus);
    if (i < idx) return 'done';
    if (i === idx) return 'current';
    return 'upcoming';
  }

  fmtDate(iso?: string) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  fmtDateTime(iso?: string) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  }

  getStepDate(order: any, i: number) {
    // We only have orderedAt and updatedAt in the API response.
    // For a real app, you might have specific dates for each step in the history.
    // Using orderedAt for the first step and updatedAt for the current step as a fallback.
    if (i === 0) return this.fmtDate(order.orderedAt);
    if (this.statusIndex(order.orderStatus) === i) return this.fmtDate(order.updatedAt);
    return '';
  }
}
