
  # Student Ride Sharing App

  This is a code bundle for Student Ride Sharing App. The original project is available at https://www.figma.com/design/iE5GzernAmwrlHSRjswtNZ/Student-Ride-Sharing-App.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Flowglad Setup (Ride Split Payments)

  Configure these environment variables for the Supabase Edge Function:

  - `FLOWGLAD_SECRET_KEY`: Your Flowglad API key (server-side secret).
  - `FLOWGLAD_RIDE_SPLIT_PRICE_SLUG`: Price slug for a "Ride Split" product.

  Recommended setup:
  - Create a one-time product in Flowglad priced at $0.01 (1 cent).
  - Use that price's slug for `FLOWGLAD_RIDE_SPLIT_PRICE_SLUG`.
  - The app sets the checkout quantity to the split amount in cents so any ride total can be charged accurately.
  
