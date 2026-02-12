import client from "./client";
import { Persona } from "@/types/persona";

export const getPersonas = (era?: string) => {
    const query = era ? `?era=${era}` : "";
    return client<Persona[]>(`/api/v1/personas${query}`);
};

export const getPersona = (id: string) => {
    return client<Persona>(`/api/v1/personas/${id}`);
};
