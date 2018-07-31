const expect = require('expect')
const request = require('supertest')

const {Message} = require('./../models/character')
const {app} = require('./../server')

describe('tests for messages methods', () => {

  it('should create new conversation between userOne and userTwo', (done) => {
    //TODO '/sendmessage'
  })

  it('should send new message in conversation between userOne and userTwo and not create new conversation', (done) => {
    //TODO '/sendmessage'
  })

  it('should return all messages from conversation', (done) => {
    //TODO '/getmessages'
  })

  it('should return count of not read messages for userOne in conversation', (done) => {
    //TODO '/'
  })

  it('should return last message from conversation', (done) => {

  })
})
