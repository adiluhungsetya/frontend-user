import client from "../shared/client/Client";

const api = "/user"

export async function getAllUser() {
    const employeeList = await client.get(api)
    return employeeList.data.data
}

export async function addUser(form) {
    delete form.id;
    const response = await client.post(api,form)
    return response.data.data
}

export async function editUser(form) {
    const response = await client.put(api,form)
    return response.data.data
}

export async function getUserById(id){
    const response = await client.get(`${api}/${id}`)
    return response.data.data
}