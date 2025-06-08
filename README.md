# Competitive Exam Papers

A web application for hosting and organizing competitive exam papers like IIT-JEE and NEET, sorted by exam type and year.

## Features

- Browse exam papers by exam type (IIT-JEE, NEET, etc.)
- Filter papers by year
- Download paper PDFs and solutions
- Modern, responsive UI built with Next.js and Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/vijay-yajiv/competitive-exam-papers.git
cd competitive-exam-papers
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `src/app/page.tsx`: Main homepage
- `src/app/exams/page.tsx`: Browse exams by type
- `src/app/exams/[examType]/[year]/page.tsx`: Exam papers for specific exam type and year
- `src/components/`: Reusable components

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## Future Enhancements

- User authentication for premium papers
- User bookmarks and favorites
- Advanced search functionality
- Analytics for paper downloads

## License

This project is licensed under the MIT License
