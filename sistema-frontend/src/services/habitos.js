import api from './api.js'

export function listarHabitos(apenasAtivos=false) {
    const endpoint = apenasAtivos ? 'habitos/?ativo=true' : 'habitos/';
    return api.get(endpoint);
}

export function obterHabito(id) {
    const endpoint = `habitos/${id}/`;
    return api.get(endpoint);
}

export function criarHabito(dados) {
    const endpoint = 'habitos/';
    return api.post(endpoint, dados);
}

export function atualizarHabito(id, dados) {
    const endpoint = `habitos/${id}/`;
    return api.patch(endpoint, dados);
}

export function pausarHabito(id) {
    const endpoint = `habitos/${id}/`;
    return api.delete(endpoint);
}