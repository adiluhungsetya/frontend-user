import React, {useEffect, useState} from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    Row
} from "reactstrap";
import {HANDLE_INPUT, RESET_FORM} from "../actions/EmployeeAction";
import {connect} from "react-redux";
import {Link, withRouter} from "react-router-dom";
import {addUser, editUser} from "../../services/EmployeeService";
import DatePicker from "react-datepicker"
import Icon from "../../shared/icons/Icon";

function FormEmployee(props) {

    const {form,handleInputChange,history,resetForm} = props
    const [job,setJob] = useState(["PNS","Wirausaha","Wiraswasta"])
    const [lastEducation,setLastEducation] = useState(
        [
            "SD",
            "SMP",
            "SMA",
            "Diploma",
            "Sarjana",
            "Magister",
            "Doktor"
        ])
    const [successMessage,setSuccessMessage] = useState({message:"",open: false})

    const handleFormSubmit = (event)=>{
        event.preventDefault()

        const date  = form.birth_date.split("-")

        form.birth_date = `${date[2]}-${date[1]}-${date[0]}`
        console.log("FORM",form)

        if (form.id){
            editUser(form)
                .then(()=>{
                    resetForm()
                    setSuccessMessage({
                        message: "Edit user success!!",
                        open: !successMessage.open
                    })
                })
        } else {
            addUser(form)
                .then(()=>{
                    resetForm()
                    setSuccessMessage({
                        message: "Insert new employee success!!",
                        open: !successMessage.open
                    })
                })
        }
    }

    const isValidForm = ()=>{
        return (form.name.trim().length>0 && form.birth_date && form.job.trim().length>0
                            && form.last_education.trim().length>0 && form.ktp.trim().length>0)
    }

    const toggleForm = ()=>{
        setSuccessMessage({message: successMessage.message,open: !successMessage.open});
        history.replace("/")
    }

    return(
        <Row style={{margin: 20}}>
            <Col md={{size:6,offset:3}}>
                <Card className="shadow">
                    <CardHeader tag="strong" className="text-center">{!form.id ? "Insert New Employee" : "Edit employee"}</CardHeader>
                    <CardBody className="p-3">
                        <Form onSubmit={handleFormSubmit}>
                            <FormGroup row>
                                <Label md={3} for="name">Employee Name</Label>
                                <Col md={9}>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Insert name"
                                        value={form.name}
                                        onChange={(event => handleInputChange("name",event.target.value))}
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label md={3}>Id Number</Label>
                                <Col>
                                    <Input
                                        type="tel"
                                        min={0}
                                        maxLength={16}
                                        id="ktp"
                                        name="ktp"
                                        placeholder="Insert identity number (KTP)"
                                        value={form.ktp}
                                        onChange={(event => {
                                            const value = event.target.value.replace(/[^0-9]/g,"")
                                            handleInputChange("ktp",value)
                                    })}/>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label md={3}>Birth Date</Label>
                                <Col md={4}>
                                    <Input
                                        type="date"
                                        name="birthDate"
                                        id="birthDate"
                                        placeholder="dd/MM/yyyy"
                                        value={form.birth_date}
                                        onChange={event => handleInputChange("birth_date",event.target.value)}
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label md={3}>Job</Label>
                                <Col md={6}>
                                    <Input
                                        type="select"
                                        id="job"
                                        name="job"
                                        value={form.job}
                                        onChange={(event => handleInputChange("job",event.target.value))}
                                    >
                                        <option>-Select job-</option>
                                        {
                                            job.map((job,index)=>{
                                                return(
                                                    <option
                                                        key={index}
                                                        value={job}
                                                    >{job}</option>
                                                )
                                            })
                                        }
                                    </Input>
                                </Col>
                            </FormGroup>

                            <FormGroup row>
                                <Label md={3}>Last Education</Label>
                                <Col md={6}>
                                    <Input
                                        type="select"
                                        id="lastEducation"
                                        name="lastEducation"
                                        value={form.last_education}
                                        onChange={(event => handleInputChange("last_education",event.target.value))}
                                    >
                                        <option>-Select last education-</option>
                                        {
                                            lastEducation.map((lastEducation,index)=>{
                                                return(
                                                    <option
                                                        key={index}
                                                        value={lastEducation}
                                                    >{lastEducation}</option>
                                                )
                                            })
                                        }
                                    </Input>
                                </Col>
                            </FormGroup>

                            <FormGroup className="mt-5" row>
                                <Col md={{offset:7}} className="mr-2">
                                    <Button
                                        type="submit"
                                        color="primary"
                                        className="shadow"
                                        disabled={!isValidForm()}
                                    ><Icon icon="fas check-square"/> Confirm </Button>
                                </Col>
                                <Col>
                                    <Link to="/">
                                        <Button
                                            type="button"
                                            className="shadow"
                                            onClick={resetForm}
                                            style={{cursor: "pointer"}}
                                        ><Icon icon="fas arrow-left"/> Back </Button>
                                    </Link>
                                </Col>
                            </FormGroup>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
            <Modal isOpen={successMessage.open} toggle={toggleForm}>
                <ModalBody>
                    <Row>
                        <Col md={9}>
                            <h4>
                                {successMessage.message}
                            </h4>
                        </Col>
                        <Col md={{offset:1}} className="ml-5">
                            <Icon icon="far check-circle" color="green" size="2x"/>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Row>
    )
}

function mapStateToProps(state) {
    return {...state}
}

function mapDispatchToProps(dispatch) {
    return {
        handleInputChange : (inputName,inputValue)=>dispatch({type:HANDLE_INPUT,payload:{inputName,inputValue}}),
        resetForm : ()=>dispatch({type:RESET_FORM})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(FormEmployee))