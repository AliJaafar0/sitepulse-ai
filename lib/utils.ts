export const cn=(...v:(string|false|null|undefined)[])=>v.filter(Boolean).join(' ');
export const formatDate=(d:string|Date)=>new Intl.DateTimeFormat('en',{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(d));
