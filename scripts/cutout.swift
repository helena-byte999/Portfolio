// Lifts the subject out of a photo with macOS Vision and writes a transparent PNG.
// Usage: swift scripts/cutout.swift <input> <output.png> [x,y ...]
// The optional x,y points (in input pixels, top-left origin) pick which detected
// instances to keep; with none, every instance is kept.
import AppKit
import CoreImage
import Vision

let args = CommandLine.arguments
guard args.count >= 3 else {
    print("usage: swift cutout.swift <input> <output.png> [x,y ...]")
    exit(1)
}
let input = URL(fileURLWithPath: args[1])
let output = URL(fileURLWithPath: args[2])
let points: [(Double, Double)] = args.dropFirst(3).compactMap {
    let p = $0.split(separator: ",").compactMap { Double($0) }
    return p.count == 2 ? (p[0], p[1]) : nil
}

let handler = VNImageRequestHandler(url: input)
let request = VNGenerateForegroundInstanceMaskRequest()
try handler.perform([request])
guard let result = request.results?.first else {
    print("no subject found")
    exit(1)
}

var keep = result.allInstances
if !points.isEmpty {
    let mask = result.instanceMask
    CVPixelBufferLockBaseAddress(mask, .readOnly)
    let w = CVPixelBufferGetWidth(mask), h = CVPixelBufferGetHeight(mask)
    let row = CVPixelBufferGetBytesPerRow(mask)
    let base = CVPixelBufferGetBaseAddress(mask)!.assumingMemoryBound(to: UInt8.self)
    let src = NSImage(contentsOf: input)!.representations.first!
    var picked = IndexSet()
    for (x, y) in points {
        let mx = Int(x / Double(src.pixelsWide) * Double(w))
        let my = Int(y / Double(src.pixelsHigh) * Double(h))
        let label = Int(base[my * row + mx])
        if label != 0 { picked.insert(label) }
    }
    CVPixelBufferUnlockBaseAddress(mask, .readOnly)
    print("instances: \(result.allInstances.count), kept: \(Array(picked))")
    keep = picked
}

let buffer = try result.generateMaskedImage(ofInstances: keep, from: handler, croppedToInstancesExtent: false)
let image = CIImage(cvPixelBuffer: buffer)
try CIContext().writePNGRepresentation(
    of: image, to: output, format: .RGBA8,
    colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
print("wrote \(output.path)")
