export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
export const todayISO = () => new Date().toISOString().slice(0, 10);
export const monthISO = (d = new Date()) => d.toISOString().slice(0, 7);
