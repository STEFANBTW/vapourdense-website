import { jsPDF } from 'jspdf';

export interface ProjectBriefData {
  businessName: string;
  industry: string;
  profileType: string;
  service: string;
  projectType?: string;
  goals: string[];
  customGoal?: string;
  feelMood?: string;
  feelDescription?: string;
  referenceWebsiteLink?: string;
  scopePages?: string;
  graphicQuantity?: string;
  brandAssets?: string;
  existingAssets?: string;
  backendOption?: string;
  backendCustomDesc?: string;
  systemCurrentState?: string;
  techStackPreference?: string;
  timelineType: string;
  timelineWeeks?: number;
  budgetType: string;
  budgetBand?: string;
  exactBudgetAmount?: number;
  fullName: string;
  email: string;
  phone: string;
  preferredContact: string;
  submittedAt: string;
  referenceId: string;
}

export const generateBriefPdf = (data: ProjectBriefData): jsPDF => {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 44;

  // Header Bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(40, y, pageWidth - 80, 52, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('VDVC', 56, y + 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('CLIENT BRIEF', 56, y + 40);

  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFontSize(9);
  doc.text(`REF: ${data.referenceId}`, pageWidth - 56, y + 24, { align: 'right' });
  doc.text(data.submittedAt, pageWidth - 56, y + 40, { align: 'right' });

  y += 74;

  const labelX = 40;
  const valueX = 185;
  const valueWidth = pageWidth - 40 - valueX;

  const drawRow = (label: string, value: string) => {
    if (!value || !value.trim()) return;

    // Standardize Naira symbol for jsPDF
    const cleanValue = value.replace(/₦/g, 'NGN ');

    // Split value into lines to fit valueWidth
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(cleanValue, valueWidth);

    // Page overflow check
    const rowHeight = Math.max(18, lines.length * 14 + 4);
    if (y + rowHeight > pageHeight - 50) {
      doc.addPage();
      y = 44;
    }

    // Label
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(label, labelX, y);

    // Value lines
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text(lines, valueX, y);

    y += rowHeight;
  };

  const drawSectionHeader = (title: string) => {
    if (y > pageHeight - 80) {
      doc.addPage();
      y = 44;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(title, 40, y);
    y += 6;
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(1);
    doc.line(40, y, pageWidth - 40, y);
    y += 16;
  };

  // Section 1: Client & Business Details
  drawSectionHeader('1. CLIENT & BUSINESS DETAILS');
  drawRow('Client Name:', data.fullName);
  drawRow('Business Name:', data.businessName);
  drawRow('Industry:', data.industry);
  drawRow('Email:', data.email);
  drawRow('Phone:', data.phone || 'Not provided');
  drawRow('Preferred Contact:', data.preferredContact);

  y += 10;

  // Section 2: Project Requirements
  drawSectionHeader('2. PROJECT REQUIREMENTS');
  drawRow('Service Requested:', data.service);
  if (data.projectType) {
    drawRow('Deliverable Type:', data.projectType);
  }

  const allGoals = [...(data.goals || [])];
  if (data.customGoal && data.customGoal.trim()) {
    allGoals.push(data.customGoal.trim());
  }
  if (allGoals.length > 0) {
    drawRow('Key Goals:', allGoals.join(', '));
  }

  if (data.feelMood) {
    drawRow('Design Style:', data.feelMood);
  }
  if (data.feelDescription && data.feelDescription.trim()) {
    drawRow('Style Notes:', data.feelDescription.trim());
  }
  if (data.referenceWebsiteLink && data.referenceWebsiteLink.trim()) {
    drawRow('Reference Link:', data.referenceWebsiteLink.trim());
  }
  if (data.scopePages) {
    drawRow('Page Count:', data.scopePages);
  }
  if (data.graphicQuantity) {
    drawRow('Design Quantity:', data.graphicQuantity);
  }
  if (data.brandAssets) {
    drawRow('Brand Assets:', data.brandAssets);
  }
  if (data.existingAssets) {
    drawRow('Existing Assets:', data.existingAssets);
  }
  if (data.techStackPreference) {
    drawRow('Tech Preferences:', data.techStackPreference);
  }
  if (data.systemCurrentState) {
    drawRow('System Status:', data.systemCurrentState);
  }

  y += 10;

  // Section 3: Timeline & Budget
  drawSectionHeader('3. TIMELINE & BUDGET');

  let timelineDisplay = data.timelineType || 'Flexible';
  if (data.timelineType === 'asap') timelineDisplay = 'As soon as possible';
  else if (data.timelineType === 'weeks') timelineDisplay = `${data.timelineWeeks || 4} Weeks`;
  else if (data.timelineType === 'flexible') timelineDisplay = 'Flexible timeline';
  drawRow('Timeline:', timelineDisplay);

  let budgetDisplay = data.budgetType || 'Not specified';
  if (data.budgetType === 'exact' || data.exactBudgetAmount) {
    budgetDisplay = data.exactBudgetAmount
      ? `NGN ${data.exactBudgetAmount.toLocaleString('en-US')}`
      : data.budgetBand || 'Custom Amount';
  } else if (data.budgetType === 'below') {
    budgetDisplay = 'Under NGN 50,000';
  } else if (data.budgetType === 'idea') {
    budgetDisplay = 'Undecided / Open to quote';
  }
  drawRow('Budget:', budgetDisplay);

  // Footer Note
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'VDVC Studio Brief — Confidential',
    pageWidth / 2,
    pageHeight - 20,
    { align: 'center' }
  );

  return doc;
};
