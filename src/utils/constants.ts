export const API_ORIGIN =
	window.location.hostname === 'ovrdrve.github.io'
		? 'https://larek-api.nomoreparties.co'
		: process.env.API_ORIGIN;
export const API_URL = `${API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${API_ORIGIN}/content/weblarek`;

export const settings = {};
