import type { Config } from 'tailwindcss';
const config: Config = {darkMode:'class',content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],theme:{extend:{colors:{ink:'#0b1020',muted:'#667085',brand:'#6d5dfc',surface:'#f7f8fc'}}},plugins:[]};
export default config;
