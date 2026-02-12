// Matches PersonaResponse.java from backend
export interface Persona {
    personaId: number;
    name: string;
    title: string; // "제4대 국왕"
    reignPeriod: string; // e.g. "1418-1450" (used for era display/filtering)
    description: string;
    profileImage: string; // backend field name
    tags: string[];
}

export interface PersonaListResponse {
    personas: Persona[];
}
