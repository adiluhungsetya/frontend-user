import React, {useEffect, useState} from "react";
import {
    Button,
    Card,
    CardHeader,
    Col,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Spinner,
    Table
} from "reactstrap";
import {FETCH_COMPLETE, HANDLE_EDIT, SET_LOADING} from "../actions/EmployeeAction";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {getAllUser, getUserById} from "../../services/EmployeeService";
import Icon from "../../shared/icons/Icon";

function EmployeeList (props) {
    const [open,setOpen] = useState(false)
    const [user,setUser] = useState({})
    const [modal,setModal] = useState(false)
    const [message,setMessage] = useState("")

    const toggle = ()=>{setOpen(!open)}
    const toggleButton = ()=>{setModal(!modal)}

    const loadData = () =>{
        const {setLoading,fetchComplete} = props
        setLoading();
        getAllUser()
            .then((user)=>{
                fetchComplete(user)
            })
    }

    useEffect(()=>{
        loadData()
    },[])

    const handleEditButton = (id) =>{
        const {handleEdit,history} = props

        handleEdit(id)

        history.replace("/form")

    }

    const handleDetailButton = (id) => {
        getUserById(id)
            .then((user) => {
                setUser(user)
            })
    }

    const generateTableRow = () =>{
        const {users,isLoading} = props
        let rows = (
            <tr>
                <td><Spinner className="text-center" type="grow" aria-colspan={6} color="info"/></td>
            </tr>
        )
        if (!isLoading){
            rows=(
                <tr>
                    <td colSpan={8} className="table-warning text-center"><strong><em>No User(s) yet.</em></strong></td>
                </tr>
            )
        }
        if (users.length>0 && !isLoading){
            rows = users.map((user,index)=>{
                return(
                    <tr key={index}>
                        <th scope="row">{index+1}</th>
                        <td>{user.name}</td>
                        <td>{user.birth_date}</td>
                        <td>{user.ktp}</td>
                        <td>{user.job}</td>
                        <td>{user.last_education}</td>
                        <td>
                            <Button type="button" color="warning" size="sm" className="shadow"
                                    onClick={()=>handleEditButton(user.id)}
                            ><Icon icon="fas edit"/> Edit</Button>
                        </td>
                        <td>
                            <Button type="button" color="danger" size="sm" className="shadow"
                                    onClick={()=>{
                                        handleDetailButton(user.id)
                                        toggle()
                                    }}
                            ><Icon icon="fas info"/> Detail </Button>
                        </td>
                    </tr>
                )
            })
        }
        return rows;
    }

    return (
        <Card className="shadow">
            <CardHeader tag="strong">
                <Row>
                    <Col >
                        <Link to="/form">
                            <Button color="primary" className="shadow"><Icon icon="fas plus"/> Add</Button>
                        </Link>
                    </Col>
                    <Col md={{size:7,offset:2}}>
                        <h3>Employee List</h3>
                    </Col>
                </Row>
            </CardHeader>
            <Table striped hover responsive className="m-0">
                <thead>
                    <tr>
                        <th width="5%">No.</th>
                        <th>Name</th>
                        <th>Birth Date</th>
                        <th>KTP</th>
                        <th>Job</th>
                        <th>LastEducation</th>
                        <th colSpan={2} width="15%" className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        generateTableRow()
                    }
                </tbody>
            </Table>
            <Modal isOpen={open} toggle={toggle}>
                <ModalHeader toggle={toggle}><h3> Detail User </h3></ModalHeader>
                <ModalBody>
                    <h4> Name           :   {user.name}</h4>
                    <h4> Birth Date     :   {user.birth_date}</h4>
                    <h4> KTP            :   {user.ktp} </h4>
                    <h4> Job            :   {user.job}</h4>
                    <h4> Last Education :   {user.last_education}</h4>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={toggle} color="primary"> OK </Button>
                </ModalFooter>
            </Modal>
            <Modal isOpen={modal} toggle={toggleButton}>
                <ModalBody>
                    {message}
                </ModalBody>
            </Modal>
        </Card>
    )
}

function mapStateToProps(state) {
    return {...state}
}

function mapDispatchToProps(dispatch) {
    return {
        handleEdit: (id) => dispatch({type:HANDLE_EDIT,payload: id}),
        setLoading: () => dispatch({type:SET_LOADING}),
        fetchComplete: (payload) => dispatch({type:FETCH_COMPLETE,payload})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(EmployeeList))