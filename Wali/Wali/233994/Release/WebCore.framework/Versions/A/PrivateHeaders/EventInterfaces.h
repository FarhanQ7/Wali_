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

enum EventInterface {
#if ENABLE(APPLE_PAY)
    ApplePayPaymentAuthorizedEventInterfaceType = 1,
    ApplePayPaymentMethodSelectedEventInterfaceType = 2,
    ApplePayShippingContactSelectedEventInterfaceType = 3,
    ApplePayShippingMethodSelectedEventInterfaceType = 4,
    ApplePayValidateMerchantEventInterfaceType = 5,
#endif
#if ENABLE(DEVICE_ORIENTATION)
    DeviceMotionEventInterfaceType = 6,
    DeviceOrientationEventInterfaceType = 7,
#endif
#if ENABLE(ENCRYPTED_MEDIA)
    MediaEncryptedEventInterfaceType = 8,
    MediaKeyMessageEventInterfaceType = 9,
#endif
#if ENABLE(GAMEPAD)
    GamepadEventInterfaceType = 10,
#endif
#if ENABLE(INDEXED_DATABASE)
    IDBVersionChangeEventInterfaceType = 11,
#endif
#if ENABLE(IOS_GESTURE_EVENTS) || ENABLE(MAC_GESTURE_EVENTS)
    GestureEventInterfaceType = 12,
#endif
#if ENABLE(LEGACY_ENCRYPTED_MEDIA)
    WebKitMediaKeyMessageEventInterfaceType = 13,
    WebKitMediaKeyNeededEventInterfaceType = 14,
#endif
#if ENABLE(MEDIA_STREAM)
    MediaStreamTrackEventInterfaceType = 15,
    OverconstrainedErrorEventInterfaceType = 16,
#endif
#if ENABLE(ORIENTATION_EVENTS)
#endif
#if ENABLE(PAYMENT_REQUEST)
    MerchantValidationEventInterfaceType = 17,
    PaymentRequestUpdateEventInterfaceType = 18,
#endif
#if ENABLE(SERVICE_WORKER)
    ExtendableEventInterfaceType = 19,
    ExtendableMessageEventInterfaceType = 20,
    FetchEventInterfaceType = 21,
#endif
#if ENABLE(SPEECH_SYNTHESIS)
    SpeechSynthesisEventInterfaceType = 22,
#endif
#if ENABLE(TOUCH_EVENTS)
    TouchEventInterfaceType = 23,
#endif
#if ENABLE(VIDEO_TRACK)
    TrackEventInterfaceType = 24,
#endif
#if ENABLE(WEBGL)
    WebGLContextEventInterfaceType = 25,
#endif
#if ENABLE(WEB_AUDIO)
    AudioProcessingEventInterfaceType = 26,
    OfflineAudioCompletionEventInterfaceType = 27,
#endif
#if ENABLE(WEB_RTC)
    MediaStreamEventInterfaceType = 28,
    RTCDataChannelEventInterfaceType = 29,
    RTCPeerConnectionIceEventInterfaceType = 30,
    RTCTrackEventInterfaceType = 31,
#endif
#if ENABLE(WEB_RTC_DTMF)
    RTCDTMFToneChangeEventInterfaceType = 32,
#endif
#if ENABLE(WIRELESS_PLAYBACK_TARGET)
    WebKitPlaybackTargetAvailabilityEventInterfaceType = 33,
#endif
    AccessibleSetValueEventInterfaceType = 34,
    AnimationEventInterfaceType = 35,
    AnimationPlaybackEventInterfaceType = 36,
    BeforeLoadEventInterfaceType = 37,
    BeforeUnloadEventInterfaceType = 38,
    ClipboardEventInterfaceType = 39,
    CloseEventInterfaceType = 40,
    CompositionEventInterfaceType = 41,
    CustomEventInterfaceType = 42,
    ErrorEventInterfaceType = 43,
    EventInterfaceType = 44,
    FocusEventInterfaceType = 45,
    HashChangeEventInterfaceType = 46,
    InputEventInterfaceType = 47,
    KeyboardEventInterfaceType = 48,
    MessageEventInterfaceType = 49,
    MouseEventInterfaceType = 50,
    MutationEventInterfaceType = 51,
    OverflowEventInterfaceType = 52,
    PageTransitionEventInterfaceType = 53,
    PopStateEventInterfaceType = 54,
    ProgressEventInterfaceType = 55,
    PromiseRejectionEventInterfaceType = 56,
    SVGZoomEventInterfaceType = 57,
    SecurityPolicyViolationEventInterfaceType = 58,
    StorageEventInterfaceType = 59,
    TextEventInterfaceType = 60,
    TransitionEventInterfaceType = 61,
    UIEventInterfaceType = 62,
    VRDisplayEventInterfaceType = 63,
    WebKitAnimationEventInterfaceType = 64,
    WebKitTransitionEventInterfaceType = 65,
    WheelEventInterfaceType = 66,
    XMLHttpRequestProgressEventInterfaceType = 67,
};

} // namespace WebCore
