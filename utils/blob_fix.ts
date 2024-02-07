/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
/*
 * There is a bug where `navigator.mediaDevices.getUserMedia` + `MediaRecorder`
 * creates WEBM files without duration metadata. See:
 * - https://bugs.chromium.org/p/chromium/issues/detail?id=642012
 * - https://stackoverflow.com/a/39971175/13989043
 *
 * This file contains a function that fixes the duration metadata of a WEBM file.
 *  - Answer found: https://stackoverflow.com/a/75218309/13989043
 *  - Code adapted from: https://github.com/mat-sz/webm-fix-duration
 *    (forked from https://github.com/yusitnikov/fix-webm-duration)
 */

/*
 * This is the list of possible WEBM file sections by their IDs.
 * Possible types: Container, Binary, Uint, Int, String, Float, Date
 */
interface Section {
  name: string
  type: string
}

const sections: Record<number, Section> = {
  0xA45DFA3: { name: 'EBML', type: 'Container' },
  0x286: { name: 'EBMLVersion', type: 'Uint' },
  0x2F7: { name: 'EBMLReadVersion', type: 'Uint' },
  0x2F2: { name: 'EBMLMaxIDLength', type: 'Uint' },
  0x2F3: { name: 'EBMLMaxSizeLength', type: 'Uint' },
  0x282: { name: 'DocType', type: 'String' },
  0x287: { name: 'DocTypeVersion', type: 'Uint' },
  0x285: { name: 'DocTypeReadVersion', type: 'Uint' },
  0x6C: { name: 'Void', type: 'Binary' },
  0x3F: { name: 'CRC-32', type: 'Binary' },
  0xB538667: { name: 'SignatureSlot', type: 'Container' },
  0x3E8A: { name: 'SignatureAlgo', type: 'Uint' },
  0x3E9A: { name: 'SignatureHash', type: 'Uint' },
  0x3EA5: { name: 'SignaturePublicKey', type: 'Binary' },
  0x3EB5: { name: 'Signature', type: 'Binary' },
  0x3E5B: { name: 'SignatureElements', type: 'Container' },
  0x3E7B: { name: 'SignatureElementList', type: 'Container' },
  0x2532: { name: 'SignedElement', type: 'Binary' },
  0x8538067: { name: 'Segment', type: 'Container' },
  0x14D9B74: { name: 'SeekHead', type: 'Container' },
  0xDBB: { name: 'Seek', type: 'Container' },
  0x13AB: { name: 'SeekID', type: 'Binary' },
  0x13AC: { name: 'SeekPosition', type: 'Uint' },
  0x549A966: { name: 'Info', type: 'Container' },
  0x33A4: { name: 'SegmentUID', type: 'Binary' },
  0x3384: { name: 'SegmentFilename', type: 'String' },
  0x1CB923: { name: 'PrevUID', type: 'Binary' },
  0x1C83AB: { name: 'PrevFilename', type: 'String' },
  0x1EB923: { name: 'NextUID', type: 'Binary' },
  0x1E83BB: { name: 'NextFilename', type: 'String' },
  0x444: { name: 'SegmentFamily', type: 'Binary' },
  0x2924: { name: 'ChapterTranslate', type: 'Container' },
  0x29FC: { name: 'ChapterTranslateEditionUID', type: 'Uint' },
  0x29BF: { name: 'ChapterTranslateCodec', type: 'Uint' },
  0x29A5: { name: 'ChapterTranslateID', type: 'Binary' },
  0xAD7B1: { name: 'TimecodeScale', type: 'Uint' },
  0x489: { name: 'Duration', type: 'Float' },
  0x461: { name: 'DateUTC', type: 'Date' },
  0x3BA9: { name: 'Title', type: 'String' },
  0xD80: { name: 'MuxingApp', type: 'String' },
  0x1741: { name: 'WritingApp', type: 'String' },
  // 0xf43b675: { name: 'Cluster', type: 'Container' },
  0x67: { name: 'Timecode', type: 'Uint' },
  0x1854: { name: 'SilentTracks', type: 'Container' },
  0x18D7: { name: 'SilentTrackNumber', type: 'Uint' },
  0x27: { name: 'Position', type: 'Uint' },
  0x2B: { name: 'PrevSize', type: 'Uint' },
  0x23: { name: 'SimpleBlock', type: 'Binary' },
  0x20: { name: 'BlockGroup', type: 'Container' },
  0x21: { name: 'Block', type: 'Binary' },
  0x22: { name: 'BlockVirtual', type: 'Binary' },
  0x35A1: { name: 'BlockAdditions', type: 'Container' },
  0x26: { name: 'BlockMore', type: 'Container' },
  0x6E: { name: 'BlockAddID', type: 'Uint' },
  0x25: { name: 'BlockAdditional', type: 'Binary' },
  0x1B: { name: 'BlockDuration', type: 'Uint' },
  0x7A: { name: 'ReferencePriority', type: 'Uint' },
  0x7B: { name: 'ReferenceBlock', type: 'Int' },
  0x7D: { name: 'ReferenceVirtual', type: 'Int' },
  0x24: { name: 'CodecState', type: 'Binary' },
  0x35A2: { name: 'DiscardPadding', type: 'Int' },
  0xE: { name: 'Slices', type: 'Container' },
  0x68: { name: 'TimeSlice', type: 'Container' },
  0x4C: { name: 'LaceNumber', type: 'Uint' },
  0x4D: { name: 'FrameNumber', type: 'Uint' },
  0x4B: { name: 'BlockAdditionID', type: 'Uint' },
  0x4E: { name: 'Delay', type: 'Uint' },
  0x4F: { name: 'SliceDuration', type: 'Uint' },
  0x48: { name: 'ReferenceFrame', type: 'Container' },
  0x49: { name: 'ReferenceOffset', type: 'Uint' },
  0x4A: { name: 'ReferenceTimeCode', type: 'Uint' },
  0x2F: { name: 'EncryptedBlock', type: 'Binary' },
  0x654AE6B: { name: 'Tracks', type: 'Container' },
  0x2E: { name: 'TrackEntry', type: 'Container' },
  0x57: { name: 'TrackNumber', type: 'Uint' },
  0x33C5: { name: 'TrackUID', type: 'Uint' },
  0x3: { name: 'TrackType', type: 'Uint' },
  0x39: { name: 'FlagEnabled', type: 'Uint' },
  0x8: { name: 'FlagDefault', type: 'Uint' },
  0x15AA: { name: 'FlagForced', type: 'Uint' },
  0x1C: { name: 'FlagLacing', type: 'Uint' },
  0x2DE7: { name: 'MinCache', type: 'Uint' },
  0x2DF8: { name: 'MaxCache', type: 'Uint' },
  0x3E383: { name: 'DefaultDuration', type: 'Uint' },
  0x34E7A: { name: 'DefaultDecodedFieldDuration', type: 'Uint' },
  0x3314F: { name: 'TrackTimecodeScale', type: 'Float' },
  0x137F: { name: 'TrackOffset', type: 'Int' },
  0x15EE: { name: 'MaxBlockAdditionID', type: 'Uint' },
  0x136E: { name: 'Name', type: 'String' },
  0x2B59C: { name: 'Language', type: 'String' },
  0x6: { name: 'CodecID', type: 'String' },
  0x23A2: { name: 'CodecPrivate', type: 'Binary' },
  0x58688: { name: 'CodecName', type: 'String' },
  0x3446: { name: 'AttachmentLink', type: 'Uint' },
  0x1A9697: { name: 'CodecSettings', type: 'String' },
  0x1B4040: { name: 'CodecInfoURL', type: 'String' },
  0x6B240: { name: 'CodecDownloadURL', type: 'String' },
  0x2A: { name: 'CodecDecodeAll', type: 'Uint' },
  0x2FAB: { name: 'TrackOverlay', type: 'Uint' },
  0x16AA: { name: 'CodecDelay', type: 'Uint' },
  0x16BB: { name: 'SeekPreRoll', type: 'Uint' },
  0x2624: { name: 'TrackTranslate', type: 'Container' },
  0x26FC: { name: 'TrackTranslateEditionUID', type: 'Uint' },
  0x26BF: { name: 'TrackTranslateCodec', type: 'Uint' },
  0x26A5: { name: 'TrackTranslateTrackID', type: 'Binary' },
  0x60: { name: 'Video', type: 'Container' },
  0x1A: { name: 'FlagInterlaced', type: 'Uint' },
  0x13B8: { name: 'StereoMode', type: 'Uint' },
  0x13C0: { name: 'AlphaMode', type: 'Uint' },
  0x13B9: { name: 'OldStereoMode', type: 'Uint' },
  0x30: { name: 'PixelWidth', type: 'Uint' },
  0x3A: { name: 'PixelHeight', type: 'Uint' },
  0x14AA: { name: 'PixelCropBottom', type: 'Uint' },
  0x14BB: { name: 'PixelCropTop', type: 'Uint' },
  0x14CC: { name: 'PixelCropLeft', type: 'Uint' },
  0x14DD: { name: 'PixelCropRight', type: 'Uint' },
  0x14B0: { name: 'DisplayWidth', type: 'Uint' },
  0x14BA: { name: 'DisplayHeight', type: 'Uint' },
  0x14B2: { name: 'DisplayUnit', type: 'Uint' },
  0x14B3: { name: 'AspectRatioType', type: 'Uint' },
  0xEB524: { name: 'ColourSpace', type: 'Binary' },
  0xFB523: { name: 'GammaValue', type: 'Float' },
  0x383E3: { name: 'FrameRate', type: 'Float' },
  0x61: { name: 'Audio', type: 'Container' },
  0x35: { name: 'SamplingFrequency', type: 'Float' },
  0x38B5: { name: 'OutputSamplingFrequency', type: 'Float' },
  0x1F: { name: 'Channels', type: 'Uint' },
  0x3D7B: { name: 'ChannelPositions', type: 'Binary' },
  0x2264: { name: 'BitDepth', type: 'Uint' },
  0x62: { name: 'TrackOperation', type: 'Container' },
  0x63: { name: 'TrackCombinePlanes', type: 'Container' },
  0x64: { name: 'TrackPlane', type: 'Container' },
  0x65: { name: 'TrackPlaneUID', type: 'Uint' },
  0x66: { name: 'TrackPlaneType', type: 'Uint' },
  0x69: { name: 'TrackJoinBlocks', type: 'Container' },
  0x6D: { name: 'TrackJoinUID', type: 'Uint' },
  0x40: { name: 'TrickTrackUID', type: 'Uint' },
  0x41: { name: 'TrickTrackSegmentUID', type: 'Binary' },
  0x46: { name: 'TrickTrackFlag', type: 'Uint' },
  0x47: { name: 'TrickMasterTrackUID', type: 'Uint' },
  0x44: { name: 'TrickMasterTrackSegmentUID', type: 'Binary' },
  0x2D80: { name: 'ContentEncodings', type: 'Container' },
  0x2240: { name: 'ContentEncoding', type: 'Container' },
  0x1031: { name: 'ContentEncodingOrder', type: 'Uint' },
  0x1032: { name: 'ContentEncodingScope', type: 'Uint' },
  0x1033: { name: 'ContentEncodingType', type: 'Uint' },
  0x1034: { name: 'ContentCompression', type: 'Container' },
  0x254: { name: 'ContentCompAlgo', type: 'Uint' },
  0x255: { name: 'ContentCompSettings', type: 'Binary' },
  0x1035: { name: 'ContentEncryption', type: 'Container' },
  0x7E1: { name: 'ContentEncAlgo', type: 'Uint' },
  0x7E2: { name: 'ContentEncKeyID', type: 'Binary' },
  0x7E3: { name: 'ContentSignature', type: 'Binary' },
  0x7E4: { name: 'ContentSigKeyID', type: 'Binary' },
  0x7E5: { name: 'ContentSigAlgo', type: 'Uint' },
  0x7E6: { name: 'ContentSigHashAlgo', type: 'Uint' },
  0xC53BB6B: { name: 'Cues', type: 'Container' },
  0x3B: { name: 'CuePoint', type: 'Container' },
  0x33: { name: 'CueTime', type: 'Uint' },
  0x37: { name: 'CueTrackPositions', type: 'Container' },
  0x77: { name: 'CueTrack', type: 'Uint' },
  0x71: { name: 'CueClusterPosition', type: 'Uint' },
  0x70: { name: 'CueRelativePosition', type: 'Uint' },
  0x32: { name: 'CueDuration', type: 'Uint' },
  0x1378: { name: 'CueBlockNumber', type: 'Uint' },
  0x6A: { name: 'CueCodecState', type: 'Uint' },
  0x5B: { name: 'CueReference', type: 'Container' },
  0x16: { name: 'CueRefTime', type: 'Uint' },
  0x17: { name: 'CueRefCluster', type: 'Uint' },
  0x135F: { name: 'CueRefNumber', type: 'Uint' },
  0x6B: { name: 'CueRefCodecState', type: 'Uint' },
  0x941A469: { name: 'Attachments', type: 'Container' },
  0x21A7: { name: 'AttachedFile', type: 'Container' },
  0x67E: { name: 'FileDescription', type: 'String' },
  0x66E: { name: 'FileName', type: 'String' },
  0x660: { name: 'FileMimeType', type: 'String' },
  0x65C: { name: 'FileData', type: 'Binary' },
  0x6AE: { name: 'FileUID', type: 'Uint' },
  0x675: { name: 'FileReferral', type: 'Binary' },
  0x661: { name: 'FileUsedStartTime', type: 'Uint' },
  0x662: { name: 'FileUsedEndTime', type: 'Uint' },
  0x43A770: { name: 'Chapters', type: 'Container' },
  0x5B9: { name: 'EditionEntry', type: 'Container' },
  0x5BC: { name: 'EditionUID', type: 'Uint' },
  0x5BD: { name: 'EditionFlagHidden', type: 'Uint' },
  0x5DB: { name: 'EditionFlagDefault', type: 'Uint' },
  0x5DD: { name: 'EditionFlagOrdered', type: 'Uint' },
  0x36: { name: 'ChapterAtom', type: 'Container' },
  0x33C4: { name: 'ChapterUID', type: 'Uint' },
  0x1654: { name: 'ChapterStringUID', type: 'String' },
  0x11: { name: 'ChapterTimeStart', type: 'Uint' },
  0x12: { name: 'ChapterTimeEnd', type: 'Uint' },
  0x18: { name: 'ChapterFlagHidden', type: 'Uint' },
  0x598: { name: 'ChapterFlagEnabled', type: 'Uint' },
  0x2E67: { name: 'ChapterSegmentUID', type: 'Binary' },
  0x2EBC: { name: 'ChapterSegmentEditionUID', type: 'Uint' },
  0x23C3: { name: 'ChapterPhysicalEquiv', type: 'Uint' },
  0xF: { name: 'ChapterTrack', type: 'Container' },
  0x9: { name: 'ChapterTrackNumber', type: 'Uint' },
  0x0: { name: 'ChapterDisplay', type: 'Container' },
  0x5: { name: 'ChapString', type: 'String' },
  0x37C: { name: 'ChapLanguage', type: 'String' },
  0x37E: { name: 'ChapCountry', type: 'String' },
  0x2944: { name: 'ChapProcess', type: 'Container' },
  0x2955: { name: 'ChapProcessCodecID', type: 'Uint' },
  0x50D: { name: 'ChapProcessPrivate', type: 'Binary' },
  0x2911: { name: 'ChapProcessCommand', type: 'Container' },
  0x2922: { name: 'ChapProcessTime', type: 'Uint' },
  0x2933: { name: 'ChapProcessData', type: 'Binary' },
  0x254C367: { name: 'Tags', type: 'Container' },
  0x3373: { name: 'Tag', type: 'Container' },
  0x23C0: { name: 'Targets', type: 'Container' },
  0x28CA: { name: 'TargetTypeValue', type: 'Uint' },
  0x23CA: { name: 'TargetType', type: 'String' },
  0x23C5: { name: 'TagTrackUID', type: 'Uint' },
  0x23C9: { name: 'TagEditionUID', type: 'Uint' },
  0x23C4: { name: 'TagChapterUID', type: 'Uint' },
  0x23C6: { name: 'TagAttachmentUID', type: 'Uint' },
  0x27C8: { name: 'SimpleTag', type: 'Container' },
  0x5A3: { name: 'TagName', type: 'String' },
  0x47A: { name: 'TagLanguage', type: 'String' },
  0x484: { name: 'TagDefault', type: 'Uint' },
  0x487: { name: 'TagString', type: 'String' },
  0x485: { name: 'TagBinary', type: 'Binary' },
}

class WebmBase<T> {
  source?: Uint8Array
  data?: T

  constructor(private name = 'Unknown', private type = 'Unknown') { }

  updateBySource() { }

  setSource(source: Uint8Array) {
    this.source = source
    this.updateBySource()
  }

  updateByData() { }

  setData(data: T) {
    this.data = data
    this.updateByData()
  }
}

class WebmUint extends WebmBase<string> {
  constructor(name: string, type: string) {
    super(name, type || 'Uint')
  }

  updateBySource() {
    // use hex representation of a number instead of number value
    this.data = ''
    for (let i = 0; i < this.source!.length; i++) {
      const hex = this.source![i].toString(16)
      this.data += padHex(hex)
    }
  }

  updateByData() {
    const length = this.data!.length / 2
    this.source = new Uint8Array(length)
    for (let i = 0; i < length; i++) {
      const hex = this.data!.substr(i * 2, 2)
      this.source[i] = Number.parseInt(hex, 16)
    }
  }

  getValue() {
    return Number.parseInt(this.data!, 16)
  }

  setValue(value: number) {
    this.setData(padHex(value.toString(16)))
  }
}

function padHex(hex: string) {
  return hex.length % 2 === 1 ? `0${hex}` : hex
}

class WebmFloat extends WebmBase<number> {
  constructor(name: string, type: string) {
    super(name, type || 'Float')
  }

  getFloatArrayType() {
    return this.source && this.source.length === 4
      ? Float32Array
      : Float64Array
  }

  updateBySource() {
    const byteArray = this.source!.reverse()
    const floatArrayType = this.getFloatArrayType()
    const floatArray = new floatArrayType(byteArray.buffer)
    this.data! = floatArray[0]
  }

  updateByData() {
    const floatArrayType = this.getFloatArrayType()
    const floatArray = new floatArrayType([this.data!])
    const byteArray = new Uint8Array(floatArray.buffer)
    this.source = byteArray.reverse()
  }

  getValue() {
    return this.data
  }

  setValue(value: number) {
    this.setData(value)
  }
}

interface ContainerData {
  id: number
  idHex?: string
  data: WebmBase<any>
}

class WebmContainer extends WebmBase<ContainerData[]> {
  offset: number = 0
  data: ContainerData[] = []

  constructor(name: string, type: string) {
    super(name, type || 'Container')
  }

  readByte() {
    return this.source![this.offset++]
  }

  readUint() {
    const firstByte = this.readByte()
    const bytes = 8 - firstByte.toString(2).length
    let value = firstByte - (1 << (7 - bytes))
    for (let i = 0; i < bytes; i++) {
      // don't use bit operators to support x86
      value *= 256
      value += this.readByte()
    }
    return value
  }

  updateBySource() {
    let end: number | undefined
    this.data = []
    for (
      this.offset = 0;
      this.offset < this.source!.length;
      this.offset = end
    ) {
      const id = this.readUint()
      const len = this.readUint()
      end = Math.min(this.offset + len, this.source!.length)
      const data = this.source!.slice(this.offset, end)

      const info = sections[id] || { name: 'Unknown', type: 'Unknown' }
      let ctr: any = WebmBase
      switch (info.type) {
        case 'Container':
          ctr = WebmContainer
          break
        case 'Uint':
          ctr = WebmUint
          break
        case 'Float':
          ctr = WebmFloat
          break
      }
      const section = new ctr(info.name, info.type)
      section.setSource(data)
      this.data.push({
        id,
        idHex: id.toString(16),
        data: section,
      })
    }
  }

  writeUint(x: number, draft = false) {
    for (
      var bytes = 1, flag = 0x80;
      x >= flag && bytes < 8;
      bytes++, flag *= 0x80
    ) { }

    if (!draft) {
      let value = flag + x
      for (let i = bytes - 1; i >= 0; i--) {
        // don't use bit operators to support x86
        const c = value % 256
        this.source![this.offset! + i] = c
        value = (value - c) / 256
      }
    }

    this.offset += bytes
  }

  writeSections(draft = false) {
    this.offset = 0
    for (let i = 0; i < this.data.length; i++) {
      const section = this.data[i]
      const content = section.data.source
      const contentLength = content!.length
      this.writeUint(section.id, draft)
      this.writeUint(contentLength, draft)
      if (!draft)
        this.source!.set(content!, this.offset)

      this.offset += contentLength
    }
    return this.offset
  }

  updateByData() {
    // run without accessing this.source to determine total length - need to know it to create Uint8Array
    const length = this.writeSections(true)
    this.source = new Uint8Array(length)
    // now really write data
    this.writeSections()
  }

  getSectionById(id: number) {
    for (let i = 0; i < this.data.length; i++) {
      const section = this.data[i]
      if (section.id === id)
        return section.data
    }

    return undefined
  }
}

class WebmFile extends WebmContainer {
  constructor(source: Uint8Array) {
    super('File', 'File')
    this.setSource(source)
  }

  fixDuration(duration: number) {
    const segmentSection = this.getSectionById(0x8538067) as WebmContainer
    if (!segmentSection)
      return false

    const infoSection = segmentSection.getSectionById(
      0x549A966,
    ) as WebmContainer
    if (!infoSection)
      return false

    const timeScaleSection = infoSection.getSectionById(
      0xAD7B1,
    ) as WebmFloat
    if (!timeScaleSection)
      return false

    let durationSection = infoSection.getSectionById(0x489) as WebmFloat
    if (durationSection) {
      if (durationSection.getValue()! <= 0)
        durationSection.setValue(duration)
      else
        return false
    }
    else {
      // append Duration section
      durationSection = new WebmFloat('Duration', 'Float')
      durationSection.setValue(duration)
      infoSection.data.push({
        id: 0x489,
        data: durationSection,
      })
    }

    // set default time scale to 1 millisecond (1000000 nanoseconds)
    timeScaleSection.setValue(1000000)
    infoSection.updateByData()
    segmentSection.updateByData()
    this.updateByData()

    return true
  }

  toBlob(type = 'video/webm') {
    return new Blob([this.source!.buffer], { type })
  }
}

/**
 * Fixes duration on MediaRecorder output.
 * @param blob Input Blob with incorrect duration.
 * @param duration Correct duration (in milliseconds).
 * @param type Output blob mimetype (default: video/webm).
 * @returns
 */
export function webmFixDuration(blob: Blob, duration: number, type = 'video/webm'): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader()

      reader.addEventListener('loadend', () => {
        try {
          const result = reader.result as ArrayBuffer
          const file = new WebmFile(new Uint8Array(result))
          if (file.fixDuration(duration))
            resolve(file.toBlob(type))
          else
            resolve(blob)
        }
        catch (ex) {
          reject(ex)
        }
      })

      reader.addEventListener('error', () => reject())

      reader.readAsArrayBuffer(blob)
    }
    catch (ex) {
      reject(ex)
    }
  })
}
