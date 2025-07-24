import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, User } from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';
import { Appointment } from '../../types';
import { Button } from '../../components/UI/Button';

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onEditAppointment: (appointment: Appointment) => void;
  onDeleteAppointment: (appointment: Appointment) => void;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  onEditAppointment,
  onDeleteAppointment
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');

  const today = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === 'next' ? 1 : -1), 1));
  };

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.toDateString() === date.toDateString();
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const renderMonthView = () => {
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 bg-gray-50"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayAppointments = getAppointmentsForDate(date);
      const isToday = date.toDateString() === today.toDateString();

      days.push(
        <div key={day} className={`h-32 border border-gray-200 p-2 ${isToday ? 'bg-blue-50' : 'bg-white'}`}>
          <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
            {day}
          </div>
          <div className="space-y-1 overflow-hidden">
            {dayAppointments.slice(0, 3).map((appointment) => (
              <div
                key={appointment.id}
                onClick={() => onEditAppointment(appointment)}
                className={`text-xs p-1 rounded cursor-pointer text-white ${getStatusColor(appointment.status)}`}
                title={`${appointment.title} - ${appointment.customerName}`}
              >
                <div className="truncate">{formatTime(appointment.date)}</div>
                <div className="truncate font-medium">{appointment.title}</div>
              </div>
            ))}
            {dayAppointments.length > 3 && (
              <div className="text-xs text-gray-500">+{dayAppointments.length - 3} more</div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
        {dayNames.map(day => (
          <div key={day} className="bg-gray-100 p-3 text-center font-medium text-gray-700 border-b border-gray-200">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });

    return (
      <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
        {weekDays.map((date, index) => {
          const dayAppointments = getAppointmentsForDate(date);
          const isToday = date.toDateString() === today.toDateString();
          
          return (
            <div key={index} className={`min-h-96 border-r border-gray-200 ${isToday ? 'bg-blue-50' : 'bg-white'}`}>
              <div className={`p-3 border-b border-gray-200 text-center ${isToday ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <div className="text-sm font-medium">{dayNames[date.getDay()]}</div>
                <div className={`text-lg font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                  {date.getDate()}
                </div>
              </div>
              <div className="p-2 space-y-1">
                {dayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    onClick={() => onEditAppointment(appointment)}
                    className={`p-2 rounded cursor-pointer text-white text-xs ${getStatusColor(appointment.status)}`}
                  >
                    <div className="font-medium">{formatTime(appointment.date)}</div>
                    <div className="truncate">{appointment.title}</div>
                    <div className="truncate opacity-80">{appointment.customerName}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex space-x-1">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex rounded-md shadow-sm">
            {(['month', 'week'] as const).map((viewType) => (
              <button
                key={viewType}
                onClick={() => setView(viewType)}
                className={`px-4 py-2 text-sm font-medium ${
                  view === viewType
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } ${viewType === 'month' ? 'rounded-l-md' : 'rounded-r-md'} border border-gray-300`}
              >
                {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
              </button>
            ))}
          </div>

          <Button
            onClick={() => setCurrentDate(new Date())}
            variant="outline"
            size="sm"
          >
            Today
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      {view === 'month' ? renderMonthView() : renderWeekView()}

      {/* Legend */}
      <div className="flex items-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded"></div>
          <span>Scheduled</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Cancelled</span>
        </div>
      </div>
    </div>
  );
};