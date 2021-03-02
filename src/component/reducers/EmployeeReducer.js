import {
    FETCH_COMPLETE,
    HANDLE_EDIT,
    HANDLE_INPUT, RESET_FORM,
    SET_LOADING,
    SUBMIT_COMPLETE
} from "../actions/EmployeeAction";

const defaultValue = {
    id: "",
    name: "",
    birth_date: "",
    ktp:"",
    job: "",
    last_education: ""
}

const initialState = {
    form:{...defaultValue},
    users:[],
    isLoading: false
}

export default function EmployeeReducer (state = initialState,action) {
    const {type,payload} = action
    switch (type) {
        case SET_LOADING:
            return {...state, isLoading: true}
        case HANDLE_INPUT:
            const form = {...state.form}
            const {inputName,inputValue} = payload
            form[inputName]= inputValue
            return {...state,form: form}
        case HANDLE_EDIT:
            const editedForm = state.users.find((user) => user.id === payload)
            const date = editedForm.birth_date.split("-")

            editedForm.birth_date = `${date[2]}-${date[1]}-${date[0]}`

            return {...state,form: editedForm}
        case SUBMIT_COMPLETE:
            return {...state,form: {...initialState},isLoading: false}
        case FETCH_COMPLETE:
            return {...state,isLoading: false, users: [...payload]}
        case RESET_FORM:
            return {...state,form: {...defaultValue}}
        default:
            return {...state}
    }
}