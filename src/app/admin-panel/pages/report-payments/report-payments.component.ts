import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-report-payments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './report-payments.component.html',
  styleUrl: './report-payments.component.scss'
})
export class ReportPaymentsComponent {
 payments = [
    { id: 'PAY001', customer: 'Alice', amount: 150.75, date: '2025-07-10' },
    { id: 'PAY002', customer: 'Bob', amount: 245.00, date: '2025-07-11' },
    { id: 'PAY003', customer: 'Charlie', amount: 95.20, date: '2025-07-12' },
  ];

  downloadReport(paymentId: string) {
    console.log('Downloading report for payment', paymentId);
    alert(`Report for ${paymentId} downloaded (dummy).`);
  }

  downloadAllReports() {
    console.log('Downloading all reports...');
    alert('All payment reports downloaded (dummy).');
  }

  editPayment(payment: any) {
    console.log('Editing payment:', payment);
    alert(`Edit payment ${payment.id} (dummy).`);
  }

  deletePayment(paymentId: string) {
    if (confirm(`Are you sure you want to delete payment ${paymentId}?`)) {
      this.payments = this.payments.filter(p => p.id !== paymentId);
    }
  }
}
