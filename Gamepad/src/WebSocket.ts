/*

Purpose: Singleton wrapper over the websocket API

Reason:
We noticed an error during development where React's rendering cycle triggered
multiple calls to the websocket creation. While the appropriate use of useEffect
solved the duplication error, it seemed worth ensuring that the application can never
create more than one connection on the same url
*/

export class WSconnection extends WebSocket {
  //singleton wrapper over WebSocket
  private static instance?: WSconnection
  private static url_?: string

  private constructor(url: string) {
    super(url)
  }

  public static getInstance(url: string) {
    if (!this.instance || WSconnection.url_ !== url) {
      this.instance = new WSconnection(url)
      WSconnection.url_ = url
    }
    return this.instance
  }

  onclose = (_: CloseEvent) => {
    WSconnection.url_ = undefined
    WSconnection.instance = undefined
  }
}
