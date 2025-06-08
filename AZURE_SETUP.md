# Setting up Azure Database for Competitive Exam Papers

This guide will walk you through setting up the required Azure resources for the Competitive Exam Papers application.

## Prerequisites

- An Azure account with an active subscription
- Azure CLI installed (optional, for command line setup)

## Setting Up Azure Cosmos DB

1. **Create a Cosmos DB account**:
   - Go to the Azure Portal (https://portal.azure.com)
   - Click "Create a resource"
   - Search for "Azure Cosmos DB"
   - Select "Azure Cosmos DB" and click "Create"
   - Choose the "Core (SQL)" API
   - Fill in the details:
     - Subscription: Your subscription
     - Resource Group: Create new or use existing
     - Account Name: A unique name for your Cosmos DB account
     - Location: Choose a region close to your users
     - Capacity mode: Serverless (to start with)
   - Click "Review + create" and then "Create"

2. **Create a database and container**:
   - Once the deployment is complete, go to your Cosmos DB account
   - Click "Data Explorer"
   - Click "New Container"
   - Fill in the details:
     - Database id: "ExamPapersDB"
     - Container id: "Papers"
     - Partition key: "/examType"
   - Click "OK"

3. **Get connection details**:
   - In your Cosmos DB account, go to "Keys"
   - Copy the "URI" and "PRIMARY KEY"
   - Add these to your `.env.local` file as:
     ```
     COSMOS_ENDPOINT=your-cosmos-db-uri
     COSMOS_KEY=your-primary-key
     ```

## Setting Up Azure Blob Storage

1. **Create a Storage account**:
   - Go to the Azure Portal
   - Click "Create a resource"
   - Search for "Storage account"
   - Click "Create"
   - Fill in the details:
     - Subscription: Your subscription
     - Resource Group: Same as used for Cosmos DB
     - Storage account name: A unique name
     - Region: Same as Cosmos DB
     - Performance: Standard
     - Account kind: StorageV2
     - Replication: Locally redundant storage (LRS)
   - Click "Review + create" and then "Create"

2. **Create a blob container**:
   - Once deployed, go to your storage account
   - Click "Containers" under "Data storage"
   - Click "+ Container"
   - Name: "exam-papers"
   - Public access level: "Blob" (allows public read access for blobs)
   - Click "Create"

3. **Get connection string**:
   - In your storage account, go to "Access keys"
   - Copy the "Connection string"
   - Add it to your `.env.local` file as:
     ```
     AZURE_STORAGE_CONNECTION_STRING=your-connection-string
     ```

## Setting Up Cross-Origin Resource Sharing (CORS)

To allow your front-end application to access the blobs:

1. Go to your Storage account
2. Click on "CORS" under "Settings"
3. Add a new CORS rule:
   - Allowed origins: `*` (or your specific domain for production)
   - Allowed methods: SELECT, GET
   - Allowed headers: *
   - Exposed headers: *
   - Max age: 86400
4. Click "Save"

## Deploying Your Application

1. Install the necessary dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with your Azure credentials (using the `.env.local.example` as a template)

3. Run the application:
   ```bash
   npm run dev
   ```

4. Visit the admin panel at `http://localhost:3000/admin` to start uploading exam papers

## Security Considerations

- For production, consider using Azure Key Vault to store your secrets
- Implement proper authentication for the admin panel
- Consider adding Azure CDN to your storage account for better performance
