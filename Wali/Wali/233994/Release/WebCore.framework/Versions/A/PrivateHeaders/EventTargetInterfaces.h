/*
 * THIS FILE WAS AUTOMATICALLY GENERATED, DO NOT EDIT.
 *
 * Copyright (C) 2011 Google Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY GOOGLE, INC. ``AS IS'' AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#pragma once

namespace WebCore {

enum EventTargetInterface {
#if ENABLE(APPLE_PAY)
    ApplePaySessionEventTargetInterfaceType = 1,
#endif
#if ENABLE(ENCRYPTED_MEDIA)
    MediaKeySessionEventTargetInterfaceType = 2,
#endif
#if ENABLE(INDEXED_DATABASE)
    IDBDatabaseEventTargetInterfaceType = 3,
    IDBOpenDBRequestEventTargetInterfaceType = 4,
    IDBRequestEventTargetInterfaceType = 5,
    IDBTransactionEventTargetInterfaceType = 6,
#endif
#if ENABLE(LEGACY_ENCRYPTED_MEDIA)
    WebKitMediaKeySessionEventTargetInterfaceType = 7,
#endif
#if ENABLE(MEDIA_SESSION)
    MediaRemoteControlsEventTargetInterfaceType = 8,
#endif
#if ENABLE(MEDIA_SOURCE)
    MediaSourceEventTargetInterfaceType = 9,
    SourceBufferEventTargetInterfaceType = 10,
    SourceBufferListEventTargetInterfaceType = 11,
#endif
#if ENABLE(MEDIA_STREAM)
    MediaDevicesEventTargetInterfaceType = 12,
    MediaStreamEventTargetInterfaceType = 13,
    MediaStreamTrackEventTargetInterfaceType = 14,
#endif
#if ENABLE(NOTIFICATIONS)
    NotificationEventTargetInterfaceType = 15,
#endif
#if ENABLE(PAYMENT_REQUEST)
    PaymentRequestEventTargetInterfaceType = 16,
#endif
#if ENABLE(SERVICE_WORKER)
    ServiceWorkerEventTargetInterfaceType = 17,
    ServiceWorkerContainerEventTargetInterfaceType = 18,
    ServiceWorkerGlobalScopeEventTargetInterfaceType = 19,
    ServiceWorkerRegistrationEventTargetInterfaceType = 20,
#endif
#if ENABLE(SPEECH_SYNTHESIS)
    SpeechSynthesisUtteranceEventTargetInterfaceType = 21,
#endif
#if ENABLE(VIDEO)
    MediaControllerEventTargetInterfaceType = 22,
#endif
#if ENABLE(VIDEO_TRACK)
    AudioTrackListEventTargetInterfaceType = 23,
    TextTrackEventTargetInterfaceType = 24,
    TextTrackCueEventTargetInterfaceType = 25,
    TextTrackListEventTargetInterfaceType = 26,
    VideoTrackListEventTargetInterfaceType = 27,
#endif
#if ENABLE(WEB_AUDIO)
    AudioContextEventTargetInterfaceType = 28,
    AudioNodeEventTargetInterfaceType = 29,
#endif
#if ENABLE(WEB_RTC)
    RTCDataChannelEventTargetInterfaceType = 30,
    RTCPeerConnectionEventTargetInterfaceType = 31,
#endif
#if ENABLE(WEB_RTC_DTMF)
    RTCDTMFSenderEventTargetInterfaceType = 32,
#endif
    AbortSignalEventTargetInterfaceType = 33,
    DOMApplicationCacheEventTargetInterfaceType = 34,
    DOMWindowEventTargetInterfaceType = 35,
    DedicatedWorkerGlobalScopeEventTargetInterfaceType = 36,
    EventSourceEventTargetInterfaceType = 37,
    FileReaderEventTargetInterfaceType = 38,
    FontFaceSetEventTargetInterfaceType = 39,
    MessagePortEventTargetInterfaceType = 40,
    NodeEventTargetInterfaceType = 41,
    OffscreenCanvasEventTargetInterfaceType = 42,
    PerformanceEventTargetInterfaceType = 43,
    VRDisplayEventTargetInterfaceType = 44,
    VisualViewportEventTargetInterfaceType = 45,
    WebAnimationEventTargetInterfaceType = 46,
    WebSocketEventTargetInterfaceType = 47,
    WorkerEventTargetInterfaceType = 48,
    XMLHttpRequestEventTargetInterfaceType = 49,
    XMLHttpRequestUploadEventTargetInterfaceType = 50,
};

} // namespace WebCore
