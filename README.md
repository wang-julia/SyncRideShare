
  # Sync Ride Share

  Sync Ride Share is a student-first carpooling app that matches riders headed to the same airport or station, lets them coordinate in chat, and split fares. Users submit ride details, browse matches, confirm rides, and pay their share via Flowglad. The app also includes Snowflake-powered analytics insights and a Gemini chat helper.

  - DevFest 2026 - Best use of Flowglad: https://devpost.com/software/sync-fk05vs
  - Original design inspiration: https://www.figma.com/design/iE5GzernAmwrlHSRjswtNZ/Student-Ride-Sharing-App.
  

  ## Tech Stack

  - Frontend: React + Vite + TypeScript
  - UI: Tailwind CSS + shadcn/ui + Lucide icons
  - Auth & storage: Supabase (Auth + Edge Functions)
  - Payments: Flowglad (checkout + ride split payments)
  - Analytics: Snowflake (Cortex + SQL API)
  - AI assistant: Gemini

  ## System Architecture

  - Client (Vite + React) handles UI, authentication, ride creation, matching, chat, and checkout initiation.
  - Supabase Auth manages user sessions.
  - Supabase Edge Function (`make-server-c63c7d45`) acts as the backend API for:
    - Profiles, chats, and ride requests (KV store)
    - Flowglad checkout session creation and status verification
    - Snowflake analytics endpoints (optimizer + Q&A)
    - Gemini chat endpoint
  - Flowglad processes checkout and returns a hosted payment URL.
  - Snowflake stores ride analytics and powers optimizer/insights.

  ```mermaid
  flowchart LR
    A[Client: Vite + React] -->|Auth| B[Supabase Auth]
    A -->|API calls| C[Supabase Edge Function<br/>make-server-c63c7d45]
    C -->|Profiles / Chats / Ride Requests| D[Supabase KV Store]
    C -->|Checkout Sessions| E[Flowglad]
    E -->|Hosted Checkout URL| A
    C -->|Analytics Queries| F[Snowflake SQL API]
    F -->|Cortex Insights| C
    C -->|Gemini Prompt| G[Gemini API]
    G -->|Chat Response| A
  ```

  ## Feature Checklist

  - Account creation and login (Supabase Auth)
  - Profile creation with Columbia email validation
  - Destination selection for airports and stations
  - Ride request creation with pickup time and preferences
  - Match discovery based on destination and time
  - Public ride request cards for matching users
  - Chat between matched riders with persistent history
  - Last message preview and unread count
  - Ride confirmation flow
  - Ride cancel/complete workflows
  - Ride split payments via Flowglad checkout
  - Payment receipt capture and status tracking
  - Snowflake Ride AI optimizer (match chance insights)
  - Snowflake analytics Q&A
  - Gemini chat widget for general assistance

  ## Frameworks/Wireframes
  - Figma Design: [https://www.figma.com/proto/cVK71jm3o7DEKYYXj7YAm4/SynC-Framework?node-id=1-2&t=KaLHHiMNEwsogYon-1](https://www.figma.com/design/cVK71jm3o7DEKYYXj7YAm4/SynC-Framework?node-id=1-2&p=f&t=M9zbbPd9xcJCOD17-0) --> link to prototype

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Flowglad Setup (Ride Split Payments)

  Configure these environment variables for the Supabase Edge Function:

  - `FLOWGLAD_SECRET_KEY`: Your Flowglad API key (server-side secret).
  - `FLOWGLAD_RIDE_SPLIT_PRICE_SLUG`: Price slug for a "Ride Split" product.
  - `FLOWGLAD_RIDE_SPLIT_PRICE_ID`: (Optional) Price ID to use instead of slug.

  Recommended setup:
  - Create a one-time product in Flowglad priced at $0.01 (1 cent).
  - Use that price's slug for `FLOWGLAD_RIDE_SPLIT_PRICE_SLUG`.
  - If slug resolution fails, set `FLOWGLAD_RIDE_SPLIT_PRICE_ID` and redeploy.
  - The app sets the checkout quantity to the split amount in cents so any ride total can be charged accurately.

  Test checkout:
  - Card number: 4242 4242 4242 4242
  - Expiration: any future date
  - CVC: any 3-digit number

  ## Snowflake AI Setup (Cortex)

  Configure these environment variables for the Supabase Edge Function:

  - `SNOWFLAKE_HOST`: Your Snowflake host, e.g. `xyz12345.snowflakecomputing.com`
  - `SNOWFLAKE_OAUTH_TOKEN`: OAuth token with access to SQL API + Cortex
  - `SNOWFLAKE_WAREHOUSE`: Warehouse to run queries
  - `SNOWFLAKE_DATABASE`: Database name
  - `SNOWFLAKE_SCHEMA`: Schema name
  - `SNOWFLAKE_ROLE`: Role with read access + Cortex
  - `SNOWFLAKE_ANALYTICS_TABLE`: Table name (default `RIDE_ANALYTICS`)

  ## Gemini Chat Setup

  Configure these environment variables for the Supabase Edge Function:

  - `GEMINI_API_KEY`: Your Gemini API key
  - `GEMINI_MODEL`: (Optional) Gemini model name (default `gemini-2.0-flash`)
  
