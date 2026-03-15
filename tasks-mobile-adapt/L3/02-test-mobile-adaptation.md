# MA-L3-02 — Test mobile adaptation on multiple devices

## Goal

Comprehensive testing of mobile adaptation on various devices and viewports to ensure quality.

## Input

- All adapted components and pages
- Testing plan from mobile adaptation document

## Output

- Test results document with bugs identified
- All critical and major bugs fixed

## Implementation Details

**Test Devices/Viewports:**

**Phones:**
- iPhone SE (375x667) — smallest iPhone
- iPhone 12 (390x844) — modern iPhone
- Android Small (360x640) — typical Android
- Android Large (412x915) — large Android

**Tablets:**
- iPad Mini (768x1024)
- iPad Pro (1024x1366)

**Testing Scenarios:**

**1. Bottom Navigation:**
- [ ] Visible on mobile (<640px)
- [ ] Hidden on tablet/desktop (>=640px)
- [ ] 6 items displayed correctly
- [ ] Active state highlights correctly
- [ ] Badges show for Inbox and Next Actions
- [ ] Badges show correct counts
- [ ] Navigation works on all items
- [ ] More opens MoreMenu dropdown

**2. MoreMenu:**
- [ ] Opens when More clicked
- [ ] Shows all 6 items
- [ ] Closes on item click
- [ ] Closes on click outside
- [ ] Navigates to correct routes

**3. TaskItem:**
- [ ] Mobile: 3 buttons (Complete, Next, •••)
- [ ] Desktop: all buttons visible
- [ ] TaskActionMenu opens correctly
- [ ] All menu actions work
- [ ] Touch targets adequate (44px)
- [ ] Text readable

**4. ProjectCard:**
- [ ] Mobile: 2 buttons (Complete, •••)
- [ ] Desktop: all buttons visible
- [ ] ProjectActionMenu opens correctly
- [ ] All menu actions work
- [ ] Touch targets adequate
- [ ] Text readable

**5. TaskForm:**
- [ ] Fields stack on mobile (1 column)
- [ ] 2 columns on desktop
- [ ] All inputs readable
- [ ] Form submits correctly

**6. Modal:**
- [ ] Fits within viewport
- [ ] Scrolls internally when tall
- [ ] Close on backdrop click
- [ ] Close on Escape key
- [ ] No backdrop scroll

**7. Dashboard:**
- [ ] 1 column on mobile
- [ ] 2 columns on tablet
- [ ] 3 columns on desktop
- [ ] Statistics readable
- [ ] No horizontal scroll

**8. Layout:**
- [ ] Header hidden on mobile
- [ ] Header visible on tablet/desktop
- [ ] Sidebar hidden on mobile
- [ ] Sidebar overlay on tablet
- [ ] Sidebar static on desktop
- [ ] No overlapping elements
- [ ] Bottom nav has clearance

**9. Navigation:**
- [ ] All routes accessible
- [ ] Back/forward browser buttons work
- [ ] URL updates correctly
- [ ] Active state correct

**10. Touch Interactions:**
- [ ] All buttons respond to taps
- [ ] No missed taps
- [ ] Fast scroll works
- [ ] Zoom/pinch works (if applicable)

**Bug Categories:**
- Critical: App crashes, data loss, navigation broken
- Major: Feature broken, poor UX, layout issues
- Minor: Visual glitches, inconsistent styling

**Testing Tools:**
- Chrome DevTools device emulation
- Real devices (if available)
- Responsive design mode in Firefox/Safari

## Steps

1. Set up testing environment (DevTools device emulation)
2. Test Bottom Navigation on all devices
3. Test MoreMenu functionality
4. Test TaskItem on all devices
5. Test ProjectCard on all devices
6. Test TaskForm on all devices
7. Test Modal on all devices
8. Test Dashboard on all devices
9. Test overall layout on all devices
10. Test navigation on all devices
11. Test touch interactions
12. Document all bugs found
13. Fix all critical bugs
14. Fix all major bugs
15. Address minor bugs if time permits

## Done When

- All test scenarios completed
- All critical bugs fixed
- All major bugs fixed
- Test results documented
- Mobile adaptation verified working on all test devices
- Application quality acceptable for production

## Effort

L (4 hours)

## Depends On

MA-L3-01 (Optimize spacing and typography)
