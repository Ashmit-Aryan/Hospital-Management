 
import axios from "axios";

const BASE_URL = "http://localhost:5000/"

const instance = axios.create({
    baseURL:BASE_URL,
});

export const getPatient = async () =>{
    try{
        const response = await instance.get("/api/patients");
        return response.data;
    }catch (e){
        console.error("Error",e);
        throw e;
    }
}

export const getDoctor = async () =>{
    try{
        const res = await instance.get("/api/doctors");
        return res.data;
    }catch(e){
        console.error("Error",e);
        throw e;
    }
}

export const getAppointments = async () =>{
    try{
        const res = await instance.get("/api/appointments");
        return res.data;
    }catch(e){
        console.error("Error",e);
        throw e;
    }
}

export const getBillings = async () =>{
    try{
        const res = await instance.get("/api/billing");
        return res.data;
    }catch(e){
        console.error("Error",e);
        throw e;
    }
}



export async function setPatients(data){
    try{
        const req = await instance.post("/api/patients",data)
        return req.status
    }catch (e){
        console.error("Error",e);
        throw e;
    }
}

export async function setAppointments(data) {
    try{
        const req = await instance.post("/api/appointments",data)
        return req.status
    }catch (e){
        console.error("Error",e);
        throw e;
    }
}

export async function setDoctors(data) {
    try{
        const req = await instance.post("/api/doctors",data)
        return req.status
    }catch (e){
        console.error("Error",e);
        throw e;
    }
}

export async function setBillis(data) {
    try{
        const req = await instance.post("/api/billing",data)
        return req.status
    }catch (e){
        console.error("Error",e);
        throw e;
    }
}