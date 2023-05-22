import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axiosInstance from '../api/axiosInstance';
import { baseURL } from '../api/constants';
import './Dashboard.css'
import NavigationBar from './NavigationBar';
import Input from './Input/Input';

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [popover, setPopover] = useState({ event: '', isOpen: false });
    const [popoverPosition, setPopoverPosition] = useState({ left: 0, top: 0 });
    const [formData, setFormData] = useState({ title: '', start: '', end: '', description: '' });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await axiosInstance.get(`${baseURL}/user/calendar`);
                setEvents(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchEvents();
    }, []);

    const _convertToDateReadable = (dateStr) => {
        if (!dateStr) return
        const convertedDate = dateStr.toLocaleString('sv-SE');
        return convertedDate
    }

    const _convertToGMT0 = (dateStr) => {
        const date = new Date(dateStr);
        dateStr = date.toISOString();
        console.log(dateStr);
        return dateStr;
    }

    const handleDateClick = (arg) => {
        console.log(arg.date);
        const position = {
            top: arg.jsEvent.clientY + 'px',
            left: arg.jsEvent.clientX - (window.innerWidth - arg.jsEvent.clientX < 239 ? 239 : 0) + 'px',
        };
        arg.date = _convertToDateReadable(arg.date);
        setFormData({ title: '', start: arg.date, end: arg.date, description: '' });
        setPopover({ event: { start: arg.date, end: arg.date, description: '' }, isOpen: true });
        setPopoverPosition(position);
    }

    const handleEventClick = (arg) => {
        arg.event = Object.assign(arg.event, arg.event.extendedProps);
        console.log(arg.event);
        const position = {
            top: arg.jsEvent.clientY + 'px',
            left: arg.jsEvent.clientX - (window.innerWidth - arg.jsEvent.clientX < 239 ? 239 : 0) + 'px',
        };
        const { title, start, description } = arg.event;
        /*
        Apparently, fullcalendar sets end to null if it is the same date and time as start.
        https://stackoverflow.com/questions/24596587/fullcalendar-return-event-end-null-when-allday-is-true
        The next line of code is the workaround for that.
        */
        const end = arg.event.end ? arg.event.end : arg.event.start;

        setFormData({ ...arg.event.extendedProps, title, start: _convertToDateReadable(start), end: _convertToDateReadable(end), description });
        setPopover({ event: arg.event, isOpen: true });
        setPopoverPosition(position);
    }


    const handleClosePopover = () => {
        setPopover({ event: '', isOpen: false });
    }


    const handleInputChange = (e) => {
        let value = e.target.value;

        // if (e.target.name === 'start' || e.target.name === 'end') {
        //     const date = new Date(value);
        //     date.setHours(date.getHours() + (date.getTimezoneOffset() / 60))
        //     value = date.toISOString();
        // }

        setFormData({ ...formData, [e.target.name]: value });
    }

    const handleCreateEvent = async () => {
        const start = _convertToGMT0(formData.start);
        const end = _convertToGMT0(formData.end);

        try {
            const newEvent = {
                title: formData.title,
                description: formData.description,
                start: start,
                end: end,
            };
            const { data } = await axiosInstance.post(`${baseURL}/user/calendar`, newEvent);
            console.log(data);
            setEvents([...events, data]);
        } catch (error) {
            console.error(error);
        }
        handleClosePopover();
    }

    const handleDeleteEvent = async () => {
        try {
            console.log(popover.event._id);
            await axiosInstance.delete(`${baseURL}/user/calendar/${popover.event._id}`);
            console.log('Type of events: ' + typeof events);
            setEvents(events.filter(event => event._id !== popover.event._id));
        } catch (error) {
            console.error(error);
        }
        handleClosePopover();
    }

    const handleUpdateEvent = async () => {
        try {
            const updatedEvent = {
                title: formData.title,
                description: formData.description,
                start: _convertToGMT0(formData.start),
                end: _convertToGMT0(formData.end),
            };
            const { data } = await axiosInstance.patch(`${baseURL}/user/calendar/${popover.event._id}`, updatedEvent);
            setEvents(events.map(event => event._id === popover.event._id ? data : event));
        } catch (error) {
            console.error(error);
        }
        handleClosePopover();
    }

    return (
        <>
            <NavigationBar />
            <div id="calendar">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                />
                {popover.isOpen && (
                    <div className="popover" style={{ top: popoverPosition.top, left: popoverPosition.left }}>
                        <button className="close" onClick={handleClosePopover}>X</button>
                        {popover.event && popover.event.title ? (
                            <>
                                <h4>{popover.event.title}</h4>
                                <div className="form-group">
                                    <label htmlFor="title">Title:</label>
                                    <Input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Description:</label>
                                    <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="start">Start:</label>
                                    <Input type="datetime-local" name="start" id="start" value={formData.start} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="end">End:</label>
                                    <Input type="datetime-local" name="end" id="end" value={formData.end} onChange={handleInputChange} />
                                </div>
                                <button className="delete" onClick={handleDeleteEvent}>Delete</button>
                                <button className="update" onClick={handleUpdateEvent}>Update</button>
                            </>
                        ) : (
                            <>
                                <div className="form-group">
                                    <label htmlFor="title">Title:</label>
                                    <Input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Description:</label>
                                    <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="start">Start:</label>
                                    {/* ? formData.start.toString("yy-MM-ddThh:mm").substring(0, formData.start.length - 1) : null */}
                                    <Input type="datetime-local" name="start" id="start" value={formData.start} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="end">End:</label>
                                    <Input type="datetime-local" name="end" id="end" value={formData.end} onChange={handleInputChange} />
                                </div>
                                <button className="create" onClick={handleCreateEvent}>Create</button>
                            </>
                        )}
                    </div>
                )}

            </div>
        </>
    );
};

export default Dashboard; 
