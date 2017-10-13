'use strict'

import EventEmitter from 'events'

import Backend from './backend'
import Access from './access'
import Peers from './peers'
import Snapshots from './snapshots'

const TYPES = ['markdown', 'richtext']

export default createDocument

class Document extends EventEmitter {
  constructor (options) {
    super()

    validateOptions(options)

    this._options = options

    const backend = this._backend = new Backend(options)

    this.access = new Access(options, backend)
    this.peers = new Peers(options, backend)
    this.snapshots = new Snapshots(options, backend)
  }

  async start () {
    await this._backend.start()
    this.emit('started')
  }

  stop () {
    this._backend.stop()
    this.emit('stopped')
  }

  bindName (input) {
    this._backend.crdt.share.name.bindTextarea(input)
  }

  bindEditor (editor) {
    if (this._options.type === 'richtext') {
      this._backend.crdt.share.richtext.bindQuill(editor)
    } else {
      this._backend.crdt.share.text.bindCodeMirror(editor)
    }
  }

  unbindEditor (editor) {
    if (this._options.type === 'richtext') {
      this._backend.crdt.share.richtext.unbindQuill(editor)
    } else {
      this._backend.crdt.share.text.unbindCodeMirror(editor)
    }
  }
}

function createDocument (options) {
  return new Document(options)
}

function validateOptions (options) {
  if (!options) {
    throw new Error('peerpad needs options')
  }

  if (!options.name) {
    throw new Error('peerpad needs name')
  }

  if (!options.type) {
    throw new Error('peerpad needs type')
  }

  if (TYPES.indexOf(options.type) < 0) {
    throw new Error('unknown peerpad type: ' + options.type)
  }

  if (!options.readKey) {
    throw new Error('peerpad needs a read key')
  }

  if (!options.docViewer) {
    throw new Error('peerpad needs a doc viewer react component class')
  }

  if (!options.docScript) {
    throw new Error('peerpad needs a doc script')
  }
}
