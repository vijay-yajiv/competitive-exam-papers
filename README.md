# Competitive Exam Papers

A web application for hosting and organizing competitive exam papers like IIT-JEE, NEET, and GATE, sorted by exam type and year.

## Features

- Browse exam papers by exam type (IIT-JEE, NEET, GATE, etc.)
- Filter papers by year and subject
- Download paper PDFs and solutions
- User authentication and favorites system
- Analytics for tracking paper views and downloads
- Admin dashboard for uploading and managing papers
- Azure Cosmos DB and Blob Storage integration for storing papers
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
- `src/app/papers/[paperId]/page.tsx`: Detailed view for a specific exam paper
- `src/app/auth/`: Authentication-related pages (sign in, sign up)
- `src/app/dashboard/`: User dashboard with favorites and statistics
- `src/app/admin/`: Admin interface for managing papers and viewing analytics
- `src/app/api/`: API routes for papers, authentication, and analytics
- `src/components/`: Reusable UI components
- `src/lib/`: Azure integration and utility functions
- `src/data/`: Sample exam paper data
- `src/types/`: TypeScript interface definitions

## Technologies Used

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Azure Cosmos DB](https://azure.microsoft.com/en-us/services/cosmos-db/) - Database for paper metadata
- [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/) - Storage for paper PDFs
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Password hashing
- [UUID](https://www.npmjs.com/package/uuid) - Generate unique IDs

## Environment Variables

To run this project, you will need to add the following environment variables to your .env.local file:

```bash
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret

# Azure
COSMOS_ENDPOINT=your_cosmos_db_endpoint
COSMOS_KEY=your_cosmos_db_key
AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string
```

## Azure Setup

For more information on setting up Azure resources for this project, see [AZURE_SETUP.md](AZURE_SETUP.md).

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Azure Cosmos DB](https://azure.microsoft.com/en-us/services/cosmos-db/) - Document database for storing exam paper metadata
- [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/) - Cloud storage for PDFs

## Azure Integration

This application uses Azure cloud services for data storage:

- **Azure Cosmos DB**: Stores metadata about exam papers including exam type, year, and links to PDFs
- **Azure Blob Storage**: Stores the actual PDF files for papers and solutions

For detailed setup instructions for Azure, see [AZURE_SETUP.md](./AZURE_SETUP.md).

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
