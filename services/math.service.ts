"use strict";

import {Service, ServiceBroker, Context} from "moleculer";

export default class GreeterService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "math",
			actions:{
				/**
				 * Say a 'Hello' action.
				 *
				 */
				add: {
					async handler(ctx:Context<any,any>): Promise<number> {
						ctx.meta.socket.emit('hello', '<< welcome >>');
						return this.ActionAdd(ctx.params.a, ctx.params.b);
					},
				},
			},
		});
	}

	// Action
	public ActionAdd(a:string, b:string): number {
		return Number(a) + Number(b);
	}
}
