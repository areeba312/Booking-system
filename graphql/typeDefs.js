module.exports = `#graphql
  type Room { roomCode: String! name: String! building: String! seats: Int! }
  type Slot { id: ID! roomCode: String! date: String! startHour: Int! seats: Int! booked: Int! }
  type BookingInfo { slotId: ID! roomName: String! date: String! startHour: Int! }
  type Student { regNo: String! name: String! email: String! bookings: [BookingInfo!]! }

  type Query {
    rooms: [Room!]!
    slots(roomCode: String, date: String): [Slot!]!
    student(regNo: String!): Student
  }

  type Mutation {
    bookSlot(regNo: String!, slotId: ID!): Slot!
    cancelBooking(regNo: String!, slotId: ID!): Boolean!
  }
`;
