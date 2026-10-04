# SitePulse AI

SitePulse AI is a web application that I built to make website monitoring easier and more organized.

The idea is simple. A user can add a website run a scan and get a look at how healthy the site is without having to check every single thing by hand.

The dashboard gives a health score out of 100. It also shows scores for performance, SEO, accessibility and security.

## Main Features

- User authentication

- Add and manage websites

- Run website health scans

- health score out of 100

- Performance score

- SEO score

- Accessibility score

- Security score

- Latest findings and detected issues

- Scan history

- Health trend chart

- AI Action Plan with suggested improvements

- Responsive dashboard

## How It Works

The user starts by adding a website to the dashboard.

Then they click the **Run Scan** button to analyze the site.

Once the finishes SitePulse creates a full report. This includes the health score and separate scores for performance, SEO, accessibility and security.

Any issues found during the scan appear in the **Latest Findings** section.

The **AI Action Plan** uses the results to give a short summary and suggest useful next steps.

SitePulse also saves scan results. This lets the user track how the website’s health changes over time.

## Technologies Used

This project was built using:

- Next.js

- React

- TypeScript

- Tailwind CSS

- Prisma

- MySQL

- Aiven Cloud Database

- Git

- GitHub

## Running the Project Locally

First install the required packages:

```bash

npm install

```

Create a `.env` file and add the needed environment variables, including the database connection details.

Then generate the Prisma client:

```bash

npx prisma generate

```

Push the database schema to the database:

```bash

npx prisma db push

```

Start the development server:

```bash

npm run dev

```

Then open the project in your browser:

```text

http://localhost:3000

```

## Project Status

SitePulse AI is complete and working well.

All the main features are, in place. These include website scanning, reports, authentication, database storage, scan history, health trends and the AI Action Plan.

## About the Project

I made SitePulse AI as a full-stack web development project.

While building it I worked on frontend development, API routes, databases, authentication, website scanning, deployment and Git/GitHub.

This project helped me understand how the different parts of a full-stack web application connect and work together.