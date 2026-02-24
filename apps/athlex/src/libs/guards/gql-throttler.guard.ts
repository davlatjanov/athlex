import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();
    
    // Get request and response from GraphQL context
    const req = ctx?.req || ctx?.request;
    const res = ctx?.res || ctx?.response;
    
    // If GraphQL context doesn't have req/res, try HTTP context
    if (!req || !res) {
      try {
        const httpContext = context.switchToHttp();
        return {
          req: req || httpContext.getRequest(),
          res: res || httpContext.getResponse(),
        };
      } catch (error) {
        console.error('Error getting request/response in GqlThrottlerGuard:', error);
        // Return minimal objects to prevent crashes
        return {
          req: req || { headers: {}, ip: 'unknown' },
          res: res || {},
        };
      }
    }
    
    return { req, res };
  }

  // Override getRequest to ensure it always returns a valid request object
  getRequest(context: ExecutionContext) {
    try {
      const gqlCtx = GqlExecutionContext.create(context);
      const ctx = gqlCtx.getContext();
      
      // Try GraphQL context first
      const req = ctx?.req || ctx?.request;
      
      if (req && req.headers) {
        return req;
      }
      
      // Fallback to HTTP context
      try {
        const httpReq = context.switchToHttp().getRequest();
        if (httpReq && httpReq.headers) {
          return httpReq;
        }
      } catch (httpError) {
        // HTTP context not available, continue
      }
      
      // If GraphQL context has request but no headers, ensure headers exist
      if (req) {
        req.headers = req.headers || {};
        return req;
      }
      
      // Last resort: return a minimal request object with headers
      console.warn('GqlThrottlerGuard: Could not get proper request object, using fallback');
      return {
        headers: {},
        ip: ctx?.req?.ip || 'unknown',
        method: 'POST',
        url: '/graphql',
      };
    } catch (error) {
      console.error('Error in GqlThrottlerGuard.getRequest:', error);
      // Return minimal request to prevent crash
      return {
        headers: {},
        ip: 'unknown',
        method: 'POST',
        url: '/graphql',
      };
    }
  }
}
