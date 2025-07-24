import React, { useState } from 'react';
import { Plus, Search, Calendar, Clock, User, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';
import { Card, CardHeader } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { AppointmentForm } from './AppointmentForm';
import { AppointmentCalendar } from './AppointmentCalendar';
import { formatDate } from '../../utils/storage';
import { Appointment } from '../../types';

export const Appointments: React.FC = () => {
  const { appointments, updateAppointment, deleteAppointment } = useBusiness();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAppointments = appointments.length;
  const scheduledAppointments = appointments.filter(a => a.status === 'scheduled').length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;

  // Upcoming appointments (next 7 days)
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingAppointments = appointments.filter(appointment => 
    appointment.status === 'scheduled' && 
    new Date(appointment.date) >= now && 
    new Date(appointment.date) <= nextWeek
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const handleDelete = (appointment: Appointment) => {
    if (confirm(`Are you sure you want to delete the appointment "${appointment.title}"?`)) {
      deleteAppointment(appointment.id);
    }
  };

  const handleStatusChange = (appointment: Appointment, status: Appointment['status']) => {
    updateAppointment(appointment.id, { status });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Schedule and manage your appointments.</p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                viewMode === 'calendar'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              Calendar
            </button>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Appointment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalAppointments}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Scheduled</p>
              <p className="text-2xl font-bold text-gray-900">{scheduledAppointments}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedAppointments}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">{cancelledAppointments}</p>
            </div>
          </div>
        </Card>
      </div>

      {viewMode === 'calendar' ? (
        <AppointmentCalendar 
          appointments={appointments}
          onEditAppointment={handleEdit}
          onDeleteAppointment={handleDelete}
        />
      ) : (
        <>
          {/* Filters */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Upcoming Appointments and All Appointments */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Appointments */}
            <div>
              <Card>
                <CardHeader title="Upcoming This Week" />
                <div className="space-y-3">
                  {upcomingAppointments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
                  ) : (
                    upcomingAppointments.slice(0, 5).map((appointment) => (
                      <div key={appointment.id} className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{appointment.title}</p>
                            <p className="text-sm text-gray-600">{appointment.customerName}</p>
                            <p className="text-sm text-blue-600">
                              {formatDate(appointment.date)} at {formatTime(appointment.date)}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>

            {/* All Appointments */}
            <div className="lg:col-span-2">
              <Card padding={false}>
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">All Appointments</h3>
                </div>
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {filteredAppointments.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm || statusFilter ? 'Try adjusting your filters.' : 'Get started by scheduling your first appointment.'}
                      </p>
                    </div>
                  ) : (
                    filteredAppointments
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((appointment) => (
                        <div key={appointment.id} className="p-6 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <h4 className="text-sm font-medium text-gray-900">{appointment.title}</h4>
                                <div className="flex items-center space-x-4 mt-1">
                                  <div className="flex items-center text-sm text-gray-500">
                                    <User className="w-4 h-4 mr-1" />
                                    {appointment.customerName}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-500">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {appointment.duration} minutes
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {formatDate(appointment.date)} at {formatTime(appointment.date)}
                                </p>
                                {appointment.description && (
                                  <p className="text-sm text-gray-500 mt-1">{appointment.description}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                              <div className="flex space-x-2">
                                {appointment.status === 'scheduled' && (
                                  <>
                                    <button
                                      onClick={() => handleStatusChange(appointment, 'completed')}
                                      className="text-green-600 hover:text-green-900"
                                      title="Mark as completed"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(appointment, 'cancelled')}
                                      className="text-red-600 hover:text-red-900"
                                      title="Cancel appointment"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleEdit(appointment)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(appointment)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* Add/Edit Appointment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
        size="lg"
      >
        <AppointmentForm
          appointment={editingAppointment}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
};