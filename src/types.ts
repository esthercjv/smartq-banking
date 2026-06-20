/**
 * SmartQ Banking Queue Management System Types
 */

export type UserRole = 'customer' | 'staff' | 'manager' | 'admin';

export interface User {
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  department?: string;
}

export interface QueueItem {
  id: string;
  ticketNumber: string;
  customerName: string;
  serviceType: string;
  status: 'waiting' | 'called' | 'serving' | 'completed' | 'no_show';
  arrivalTime: string;
  calledTime?: string;
  completedTime?: string;
  counterId?: string;
  estimatedWaitMinutes: number;
}

export interface CounterStatus {
  id: string;
  number: number;
  staffName: string;
  currentTicket?: string;
  status: 'active' | 'break' | 'offline';
  serviceType: string;
}
