declare module 'co-body' {
  import { IncomingMessage } from 'http';

  namespace coBody {
    function text(req: IncomingMessage): string;
  }
  export = coBody;
}
