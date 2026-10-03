import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main(){
 const email=process.env.ADMIN_EMAIL||'admin@example.com'; const password=process.env.ADMIN_PASSWORD||'ChangeMe123!';
 const hash=await bcrypt.hash(password,12);
 const user=await prisma.user.upsert({where:{email},update:{passwordHash:hash,role:Role.ADMIN,name:'SitePulse Admin'},create:{email,passwordHash:hash,role:Role.ADMIN,name:'SitePulse Admin'}});
 const count=await prisma.website.count({where:{userId:user.id}});
 if(!count){const site=await prisma.website.create({data:{userId:user.id,name:'Example Store',url:'https://example.com'}}); await prisma.scan.create({data:{websiteId:site.id,score:92,performance:95,seo:96,accessibility:88,security:90,responseMs:312,pageTitle:'Example Domain',description:'Example Domain',findings:[{category:'SEO',severity:'low',title:'Add social preview metadata',detail:'Open Graph metadata is not present on the scanned page.'}]}});}
 console.log(`Seeded ${email}`);
}
main().finally(()=>prisma.$disconnect());
