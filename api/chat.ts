import { serve } from './_lib/serve.js';
import { handleChat } from './_lib/handlers.js';

export default serve(handleChat);
