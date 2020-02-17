module.exports = {

	/** Mapping schema objects */
	schemaMapping: {
		appointment: Appointment,
		service: Appointment,
		employee: Admin,
		product: Appointment,
	},

	/** Pre-requirements mapping */

	preqMapping: {
		appointment: {
			count: {
				service: [{ "$unwind": "$services" }],
				employee: [{ "$unwind": "$services" }],
				product: [{ "$unwind": "$products" }],
				receptionist: [],
				client: [],
				membership: [],
				date: [],
				offer: [],
				branch: []
			},
			revenue: {
				service: [{ "$unwind": "$services" }],
				employee: [{ "$unwind": "$services" }],
				receptionist: [{ "$unwind": "$services" }],
				client: [{ "$unwind": "$services" }],
				membership: [{ "$unwind": "$services" }],
				product: [{ "$unwind": "$products" }],
				date: [{ "$unwind": "$services" }],
				offer: [{ "$unwind": "$services" }],
				branch: [{ "$unwind": "$services" }]
			}
		},


		service: {
			count: {
				service: [{ "$unwind": "$services" }],
				employee: [{ "$unwind": "$services" }],
				product: [{ "$unwind": "$services" }, { "$unwind": "$products" }],
				receptionist: [{ "$unwind": "$services" }],
				client: [{ "$unwind": "$services" }],
				membership: [{ "$unwind": "$services" }],
				date: [{ "$unwind": "$services" }],
				offer: [{ "$unwind": "$services" }],
				branch: [{ "$unwind": "$services" }]
			},
			revenue: {
				service: [{ "$unwind": "$services" }],
				employee: [{ "$unwind": "$services" }],
				product: [{ "$unwind": "$services" }, { "$unwind": "$products" }],
				receptionist: [{ "$unwind": "$services" }],
				client: [{ "$unwind": "$services" }],
				membership: [{ "$unwind": "$services" }],
				date: [{ "$unwind": "$services" }],
				offer: [{ "$unwind": "$services" }],
				branch: [{ "$unwind": "$services" }]
			}
		},

		product: {
			count: {
				service: [{ "$unwind": "$services" }, { "$unwind": "$products" }],
				employee: [{ "$unwind": "$products" }],
				product: [{ "$unwind": "$products" }],
				receptionist: [{ "$unwind": "$products" }],
				client: [{ "$unwind": "$products" }],
				membership: [{ "$unwind": "$products" }],
				date: [{ "$unwind": "$products" }],
				offer: [{ "$unwind": "$products" }],
				branch: [{ "$unwind": "$products" }]
			},
			revenue: {
				service: [{ "$unwind": "$services" }, { "$unwind": "$products" }],
				employee: [{ "$unwind": "$products" }],
				product: [{ "$unwind": "$products" }],
				receptionist: [{ "$unwind": "$products" }],
				client: [{ "$unwind": "$products" }],
				membership: [{ "$unwind": "$products" }],
				date: [{ "$unwind": "$products" }],
				offer: [{ "$unwind": "$products" }],
				branch: [{ "$unwind": "$products" }]
			}
		},
	},

	/** Aggregate operation mapping */
	operationMapping: {
		appointment:{
			count: {
				service: { '$sum': 1 },
				employee: { '$sum': 1 },
				receptionist: { '$sum': 1 },
				client: { '$sum': 1 },
				membership: { '$sum': 1 },
				product: { '$sum': 1 },
				date: { '$sum': 1 },
				offer: { '$sum': 1 },
				branch: { '$sum': 1 },
				week: { '$sum': 1 },
				month: { '$sum': 1 },
				day: { '$sum': 1 },
				hour: { '$sum': 1 }
			},
			revenue: {
				service: { '$sum': '$services.price' },
				employee: { '$sum': '$services.price' },
				receptionist: { '$sum': '$services.price' },
				client: { '$sum': '$services.price' },
				product: { '$sum': '$products.price' },
				membership: { '$sum': '$services.price' },
				date: { '$sum': '$services.price' },
				offer: { '$sum': '$services.price' },
				branch: { '$sum': '$services.price' },
				week: { '$sum': '$services.price' },
				month: { '$sum': '$services.price' },
				day: { '$sum': '$services.price' },
				hour: { '$sum': '$services.price' }
			}
		},

		service:{
			count: {
				service: { '$sum': 1 },
				employee: { '$sum': 1 },
				receptionist: { '$sum': 1 },
				client: { '$sum': 1 },
				membership: { '$sum': 1 },
				product: { '$sum': 1 },
				date: { '$sum': 1 },
				offer: { '$sum': 1 },
				branch: { '$sum': 1 },
				week: { '$sum': 1 },
				month: { '$sum': 1 },
				day: { '$sum': 1 },
				hour: { '$sum': 1 }
			},
			revenue: {
				service: { '$sum': '$services.price' },
				employee: { '$sum': '$services.price' },
				receptionist: { '$sum': '$services.price' },
				client: { '$sum': '$services.price' },
				product: { '$sum': '$services.price' },
				membership: { '$sum': '$services.price' },
				date: { '$sum': '$services.price' },
				offer: { '$sum': '$services.price' },
				branch: { '$sum': '$services.price' },
				week: { '$sum': '$services.price' },
				month: { '$sum': '$services.price' },
				day: { '$sum': '$services.price' },
				hour: { '$sum': '$services.price' }
			}
		},

		product:{
			count: {
				service: { '$sum': 1 },
				employee: { '$sum': 1 },
				receptionist: { '$sum': 1 },
				client: { '$sum': 1 },
				membership: { '$sum': 1 },
				product: { '$sum': 1 },
				date: { '$sum': 1 },
				offer: { '$sum': 1 },
				branch: { '$sum': 1 },
				week: { '$sum': 1 },
				month: { '$sum': 1 },
				day: { '$sum': 1 },
				hour: { '$sum': 1 }
			},
			revenue: {
				service: { '$sum': '$products.price' },
				employee: { '$sum': '$products.price' },
				receptionist: { '$sum': '$products.price' },
				client: { '$sum': '$products.price' },
				product: { '$sum': '$products.price' },
				membership: { '$sum': '$products.price' },
				date: { '$sum': '$products.price' },
				offer: { '$sum': '$products.price' },
				branch: { '$sum': '$products.price' },
				week: { '$sum': '$products.price' },
				month: { '$sum': '$products.price' },
				day: { '$sum': '$products.price' },
				hour: { '$sum': '$products.price' }
			}
		},
		
	},


	/** Primary Column Mapping */
	columnMapping: {
		appointment: {
			count: {
				service: '$services.name',
				product: '$products.name',
				employee: '$services.employee',
				receptionist: '$receptionist.name',
				client: '$client.name',
				membership: '$client.membership.mtype',
				date: '$appointmentStartTime',
				offer: '$offer.name',
				branch: '$parlorId',
				week: { '$week': '$appointmentStartTime' },
				month: { '$month': '$appointmentStartTime' },
				day: { '$dayOfYear': '$appointmentStartTime' },
				hour: { '$hour': '$appointmentStartTime' }
			},
			revenue: {
				service: '$services.name',
				product: '$products.name',
				employee: '$services.employee',
				receptionist: '$receptionist.name',
				client: '$client.name',
				membership: '$client.membership.mtype',
				date: '$appointmentStartTime',
				offer: '$offer.name',
				branch: '$parlorId',
				week: { '$week': 'appointmentStartTime' },
				month: { '$month': 'appointmentStartTime' },
				day: { '$dayOfYear': '$appointmentStartTime' },
				hour: { '$hour': 'appointmentStartTime' }
			}
		},

		service: {
			count: {
				service: '$services.name',
				product: '$services.name',
				employee: '$services.employee',
				receptionist: '$receptionist.name',
				client: '$client.name',
				membership: '$client.membership.mtype',
				date: '$appointmentStartTime',
				offer: '$offer.name',
				branch: '$parlorId',
				week: { '$week': '$appointmentStartTime' },
				month: { '$month': '$appointmentStartTime' },
				day: { '$dayOfYear': '$appointmentStartTime' },
				hour: { '$hour': '$appointmentStartTime' }
			},
			revenue: {
				service: '$services.name',
				product: '$services.name',
				employee: '$services.employee',
				receptionist: '$receptionist.name',
				client: '$client.name',
				membership: '$client.membership.mtype',
				date: '$appointmentStartTime',
				offer: '$offer.name',
				branch: '$parlorId',
				week: { '$week': 'appointmentStartTime' },
				month: { '$month': 'appointmentStartTime' },
				day: { '$dayOfYear': '$appointmentStartTime' },
				hour: { '$hour': 'appointmentStartTime' }
			}
		},

		product: {
			count: {
				service: '$services.name',
				product: '$products.name',
				employee: '$products.employee',
				receptionist: '$receptionist.name',
				client: '$client.name',
				membership: '$client.membership.mtype',
				date: '$appointmentStartTime',
				offer: '$offer.name',
				branch: '$parlorId',
				week: { '$week': '$appointmentStartTime' },
				month: { '$month': '$appointmentStartTime' },
				day: { '$dayOfYear': '$appointmentStartTime' },
				hour: { '$hour': '$appointmentStartTime' }
			},
			revenue: {
				service: '$services.name',
				product: '$products.name',
				employee: '$products.employee',
				receptionist: '$receptionist.name',
				client: '$client.name',
				membership: '$client.membership.mtype',
				date: '$appointmentStartTime',
				offer: '$offer.name',
				branch: '$parlorId',
				week: { '$week': 'appointmentStartTime' },
				month: { '$month': 'appointmentStartTime' },
				day: { '$dayOfYear': '$appointmentStartTime' },
				hour: { '$hour': 'appointmentStartTime' }
			}
		}
	},

	/** Filter Column Mapping */
	filterMapping: {
		service: 'services.name',
		employee: 'services.employee',
		receptionist: 'receptionist.name',
		client: 'client.name',
		membership: 'client.membership.mtype',
		date: 'appointmentStartTime',
		offer: 'offer.name',
		branch: 'parlorId'
	}
};