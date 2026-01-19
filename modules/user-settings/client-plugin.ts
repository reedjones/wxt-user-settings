let internalValue = 0;

console.log('Plugin loaded!', globalThis.location?.href ?? 'no-location');
internalValue = Math.random();

export function doSomething() {
    console.log('plugin: Internal value =', internalValue);
}
