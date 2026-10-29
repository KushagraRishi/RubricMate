import { serve } from './_lib/serve';
import { handleChat } from './_lib/handlers';

export default serve(handleChat);
