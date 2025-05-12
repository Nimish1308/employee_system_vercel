import React from 'react'
import { useState } from 'react'
import { Button, Form, Table } from 'react-bootstrap'
import axios from 'axios'
import { useEffect } from 'react'
import { NavLink } from 'react-router'

const Record = () => {
    //Fetch all records
    const [record, setRecord] = useState([]);

    //Filter Field
    const [btnFilter, setFilter] = useState([]);

    const getFilter = (cat) => {
        try {
            const res = record.filter((item) => (item.field === cat))
            setFilter(res);
            console.log(`Filter Field Found`);

        } catch (error) {
            console.error(`Filter Field Not Found`);

        }
    }

    //Pagination Logic
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;

    const currentIndex = btnFilter.slice(indexOfFirstItem, indexOfLastItem);
    const totalPage = Math.ceil(record.length / rowsPerPage);

    const btnPrev = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1))
    }

    const btnNext = () => {
        setCurrentPage((next) => Math.min(next + 1, totalPage))
    }

    const nextProceed = (current) => {
        setCurrentPage(current)
    }
    //Create Employee
    const [input, setInput] = useState({
        name: "",
        age: "",
        gender: "",
        field: "",
        description: "",
        photo: ""
    })

    const handleChange = (event) => {
        const { name, files } = event.target;
        if (name === 'photo') {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = () => {
                setInput((prev) => ({
                    ...prev,
                    photo: reader.result
                }))
            }

            reader.readAsDataURL(file)
        }
        else {
            setInput((prev) => ({
                ...prev,
                [event.target.name]: event.target.value,
            }))
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const res = await axios.post(`http://localhost:5000/create`, input);
            console.log(`Employee Details Added Successfully`);
            getRecord();
        } catch (error) {
            console.log(`Failed To Add Details`);

        }

    }

    const getRecord = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/find`);
            const store = res.data;
            setRecord(store);
            setFilter(store);
            console.log(`All Record Fetched Successfully`);

        } catch (error) {
            console.error(`Record Fetching Failed`);

        }
    }

    //Delete Record
    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`http://localhost:5000/delete/${id}`);
            console.log(`Employee Record Deleted`);
            getRecord()

        } catch (error) {
            console.error(`Failed To Delete Record`);

        }
    }

    //Field/Employee Search using Search Bar
    const handleSearch = (e) => {
        const text = e.target.value.toLowerCase();
        if (text === "") {
            setFilter(record)
        }
        else {
            const res = btnFilter.filter((item) => {
                return (item.field.toLowerCase().includes(text) || item.name.toLowerCase().includes(text))
            })
            setFilter(res);
        }
    }

    useEffect(() => {
        getRecord();
    }, [])

    return (
        <>
            <Form className='container' style={{ border: '2px solid black', margin: '20px', padding: '20px', borderRadius: '30px' }}
                onSubmit={handleSubmit}
                onReset={() => {
                    setInput({
                        name: "",
                        age: "",
                        gender: "",
                        field: "",
                        description: ""
                    })
                }}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Full Name:</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" name='name' value={input.name} onChange={handleChange} />

                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Age:</Form.Label>
                    <Form.Control type="text" placeholder="Enter age" name='age' value={input.age} onChange={handleChange} />

                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail" id='gender_body'>
                    <Form.Label>Gender:</Form.Label>

                    <Form.Check type="radio" label="Male" value="Male" name='gender' id='gender'
                        checked={input.gender === "Male"} onChange={handleChange} />

                    <Form.Check type="radio" label="Female" value="Female" name='gender' id='gender'
                        checked={input.gender === "Female"} onChange={handleChange} />

                    <Form.Check type="radio" label="Other" value="Other" name='gender' id='gender'
                        checked={input.gender === "Other"} onChange={handleChange} />

                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Field:</Form.Label>
                    <Form.Control as='select' name='field' value={input.field} onChange={handleChange}>
                        <option value="">Select Field</option>
                        <option value="MERN">MERN</option>
                        <option value="FSD">FSD</option>
                        <option value="Associate">Associate</option>
                        <option value="IT">IT</option>
                    </Form.Control>

                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Description:</Form.Label>
                    <Form.Control as='textarea' rows={4} placeholder="Enter description" name='description' value={input.description} onChange={handleChange} />

                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Upload Photo:</Form.Label>
                    <Form.Control type="file" name='photo' onChange={handleChange} />

                </Form.Group>


                <Button variant="primary" type="submit" id='    '>
                    Create
                </Button>

                <Button variant="primary" type="reset" id='btn_type'>
                    Reset
                </Button>
            </Form>

            <div className="container" style={{ margin: '10px', padding: '10px' }}>
                <b>Sort By:</b>
                <Button variant="warning" id='filter_btn' onClick={() => setFilter(record)}>All</Button>
                <Button variant="warning" id='filter_btn' onClick={() => getFilter("MERN")}>MERN</Button>
                <Button variant="warning" id='filter_btn' onClick={() => getFilter("FSD")}>FSD</Button>
                <Button variant="warning" id='filter_btn' onClick={() => getFilter("Associate")}>Associate</Button>
                <Button variant="warning" id='filter_btn' onClick={() => getFilter("IT")}>IT</Button>

                <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" style={{ float: 'right', width: '400px', border: '2px solid black' }}
                    onChange={handleSearch} />
            </div>

            <Table striped bordered hover className='container' style={{ margin: '20px', padding: '20px', border: '2px solid black', height: '400px' }}>
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Gender</th>
                        <th>Field</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        record.length === 0 || btnFilter.length === 0 ? (
                            <tr>
                                <td colSpan={7}>Record is empty</td>
                            </tr>
                        ) : (
                            currentIndex.map((item, i) => (
                                <tr key={i}>
                                    <td>{indexOfFirstItem + i + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.age}</td>
                                    <td>{item.gender}</td>
                                    <td>{item.field}</td>
                                    <td>{item.description.substring(0, 25)}...</td>
                                    <td>
                                        <NavLink to={`/findbyid/${item._id}`}><Button variant="success" id='btn_action'>Details</Button></NavLink>
                                        <NavLink to={`/update/${item._id}`}> <Button variant="warning" id='btn_action'>Update</Button></NavLink>
                                        <Button variant="danger" id='btn_action' onClick={() => handleDelete(item._id)}>Delete</Button>
                                    </td>
                                </tr>

                            ))
                        )
                    }
                </tbody>
            </Table>

            <div className="container" style={{margin:'0'}}>
                <Button variant="danger" onClick={btnPrev} disabled={currentPage == 1} id='btn_page'>Prev</Button>
            {
                Array.from({ length: totalPage }, (_, index) => (
                    <Button variant="danger" onClick={() => nextProceed(index + 1)} className={currentPage===index+1 ? 'active':''} id='btn_page'>{index + 1}</Button>
                ))
            }
            <Button variant="danger" onClick={btnNext} disabled={currentPage == totalPage} id='btn_page'>Next</Button>
            </div>
        </>
    )
}

export default Record
