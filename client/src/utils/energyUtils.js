export function getEnergy() {
  return Number(localStorage.getItem("energy") || 10);
}
export function setEnergy(val) {
  localStorage.setItem("energy", val);
}
export function getLastEnergyTime() {
  return Number(localStorage.getItem("lastEnergyTime") || Date.now());
}
export function setLastEnergyTime(val) {
  localStorage.setItem("lastEnergyTime", val);
}
