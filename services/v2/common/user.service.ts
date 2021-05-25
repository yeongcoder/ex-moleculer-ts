"use strict";

import {Service, ServiceBroker, Context} from "moleculer";

export default class UserService extends Service {

	public constructor(public broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "user",
			version: 2,
			actions:{
				/**
				 * Login action.
				 *
				 */
				hello: {
					rest: {
						method: "GET",
						path: "/hello",
					},
					async handler(ctx: Context): Promise<string> {
						return this.ActionLogin();
					},
				},
			},
		});
	}

	// Action
	public ActionLogin(): string {
		return `hello ${this.name}`;
	}
}
