<?php
/**
 * PdfReceipt - Minimal PDF Receipt Generator (Pure PHP, no dependencies)
 * Generates a thermal-style A5 receipt PDF using raw PDF format.
 * Uses only standard PDF Type1 fonts (Helvetica, Helvetica-Bold, Courier) 
 * so no font files needed.
 *
 * Usage:
 *   $pdf = new PdfReceipt();
 *   $pdfString = $pdf->generate($orderData);
 *   // Then attach $pdfString to email via PHPMailer addStringAttachment()
 */
class PdfReceipt {
    private $objects = [];
    private $objCount = 0;
    private $fonts = [];
    private $pageWidth  = 419.53; // A5 width in pt (148mm)
    private $pageHeight = 595.28; // A5 height in pt (210mm)
    private $margin = 28; // ~10mm
    private $contentWidth;
    private $y;       // current Y position (from top)
    private $stream = '';
    private $streamLen = 0;

    public function __construct() {
        $this->contentWidth = $this->pageWidth - 2 * $this->margin;
        $this->y = $this->pageHeight - $this->margin; // start from top
    }

    /** Build and return raw PDF string */
    public function generate(array $order): string {
        // Reset state
        $this->objects = [];
        $this->objCount = 0;
        $this->stream = '';
        $this->y = $this->pageHeight - $this->margin;

        // Parse order data
        $orderId     = $order['order_id'] ?? date('YmdHis');
        $orderIdShort = preg_replace('/^(ORD-|LEO-)/', '', $orderId);
        $orderTime   = $order['order_time'] ?? date('d.m.Y H:i');
        $customerName = trim($order['customer_name'] ?? 'Gast');
        $phone       = $order['phone'] ?? '';
        $address     = $order['delivery_address'] ?? '';
        if (is_array($address)) {
            $street = $address['street'] ?? '';
            $houseNum = $address['house_number'] ?? $address['houseNumber'] ?? $address['housenumber'] ?? '';
            $streetLine = trim($street . ' ' . $houseNum);
            $cityLine = trim(($address['postal'] ?? '') . ' ' . ($address['city'] ?? ''));
            $address = trim($streetLine . ', ' . $cityLine, ', ');
        }
        $serviceType = $order['service_type'] ?? 'pickup';
        $payMethod   = $order['payment_method'] ?? 'cash';
        $items       = $order['items'] ?? [];
        $subtotal    = $this->parseEuroAmount($order['subtotal'] ?? 0);
        $deliveryFee = $this->parseEuroAmount($order['delivery_fee'] ?? 0);
        $tip         = $this->parseEuroAmount($order['tip'] ?? 0);
        $discount    = $this->parseEuroAmount($order['discount'] ?? 0);
        $total       = $order['total'] ?? '0,00';
        $note        = $order['note'] ?? '';

        // Labels
        if ($serviceType === 'delivery') $serviceLabel = 'Lieferung';
        elseif ($serviceType === 'reservation') $serviceLabel = 'Reservierung';
        else $serviceLabel = 'Abholung';

        $pmStr = strtolower((string)($payMethod ?? 'cash'));
        if (strpos($pmStr, 'paypal') !== false) {
            $payLabel = 'PayPal';
        } elseif (strpos($pmStr, 'card') !== false || strpos($pmStr, 'kartenzahlung') !== false || strpos($pmStr, 'thẻ') !== false) {
            $payLabel = 'Kartenzahlung';
        } else {
            $payLabel = 'Barzahlung'; // default to Cash
        }

        // ---- Build page content stream ----
        $s = '';

        // Header background box
        $s .= $this->rect(0, $this->pageHeight - 95, $this->pageWidth, 95, [0.08, 0.08, 0.1]);

        // Restaurant name
        $s .= $this->text('LEO SUSHI', $this->pageWidth / 2, $this->pageHeight - 35, 22, 'HB', [0.83, 0.81, 0.52], 'center');
        // Branch address
        $branchAddr = 'Florastrasse 10A, 13187 Berlin';
        if (!empty($order['branch'])) {
            $branchAddr = ($order['branch']['id'] === 'branch_haupt') ? 'Hauptstrasse 29a, 13158 Berlin' : 'Florastrasse 10A, 13187 Berlin';
        }
        $s .= $this->text($branchAddr, $this->pageWidth / 2, $this->pageHeight - 52, 8.5, 'H', [0.7, 0.7, 0.7], 'center');
        $branchPhone = ($order['branch']['id'] === 'branch_haupt') ? '030 55617056' : '03037476736';
        $s .= $this->text('Tel: ' . $branchPhone, $this->pageWidth / 2, $this->pageHeight - 63, 8.5, 'H', [0.7, 0.7, 0.7], 'center');
        // RECHNUNG badge area
        $s .= $this->rect($this->pageWidth/2 - 40, $this->pageHeight - 84, 80, 16, [0.83, 0.81, 0.52]);
        $s .= $this->text('RECHNUNG', $this->pageWidth / 2, $this->pageHeight - 75, 9, 'HB', [0.08, 0.08, 0.1], 'center');

        $this->y = $this->pageHeight - 110;

        // Order info section
        $s .= $this->sectionTitle('BESTELLDETAILS');
        $s .= $this->infoRow('Rechnungsnr.', '#' . substr($orderIdShort, -10));
        $s .= $this->infoRow('Datum & Uhrzeit', $orderTime);
        $s .= $this->infoRow('Kunde', $customerName);
        if ($phone) $s .= $this->infoRow('Telefon', $phone);
        $s .= $this->infoRow('Service', $serviceLabel);
        $s .= $this->infoRow('Zahlung', $payLabel);
        if ($address) $s .= $this->infoRow('Lieferadresse', $address, true);
        $s .= $this->divider();

        // Items
        $s .= $this->sectionTitle('ARTIKEL');
        // Table header
        $col1 = $this->margin;
        $col2 = $this->margin + $this->contentWidth * 0.55;
        $col3 = $this->margin + $this->contentWidth * 0.73;
        $col4 = $this->pageWidth - $this->margin;

        $s .= $this->tableHeader(['Artikel', 'Menge', 'Einzelpr.', 'Gesamt'], [$col1, $col2, $col3, $col4]);

        foreach ($items as $item) {
            $name     = substr($item['name'] ?? 'N/A', 0, 28);
            $qty      = $item['quantity'] ?? $item['qty'] ?? 1;
            $unitPrice = isset($item['price']) ? sprintf('%.2f', $this->parseEuroAmount($item['price'])) : '-';
            $itemTotal = isset($item['total']) ? sprintf('%.2f', $this->parseEuroAmount($item['total'])) : '0.00';

            $s .= $this->tableRow(
                $name,
                (string)$qty . 'x',
                'EUR' . $unitPrice,
                'EUR' . $itemTotal,
                [$col1, $col2, $col3, $col4]
            );

            $itemNote = trim((string)($item['note'] ?? $item['notes'] ?? $item['options'] ?? $item['comment'] ?? ''));
            if ($itemNote !== '') {
                $safeNote = '> Hinweis: ' . substr($itemNote, 0, 42);
                $s .= $this->text($safeNote, $col1 + 6, $this->y + 2, 7.5, 'HB', [0.85, 0.2, 0.2]);
                $this->y -= 10;
            }
        }
        $s .= $this->divider();

        // Totals
        if ($subtotal > 0)    $s .= $this->totalRow('Zwischensumme', sprintf('EUR%.2f', $subtotal));
        if ($deliveryFee > 0) $s .= $this->totalRow('Liefergebuehr', sprintf('EUR%.2f', $deliveryFee));
        if ($tip > 0)         $s .= $this->totalRow('Trinkgeld', sprintf('EUR%.2f', $tip));
        if ($discount > 0)    $s .= $this->totalRow('Rabatt', sprintf('-EUR%.2f', $discount));

        // Grand total box
        $boxH = 20;
        $boxY = $this->y - $boxH;
        $s .= $this->rect($this->margin, $boxY, $this->contentWidth, $boxH, [0.08, 0.08, 0.1]);
        $s .= $this->text('GESAMT', $this->margin + 6, $this->y - 6, 11, 'HB', [0.83, 0.81, 0.52]);
        $totalAmount = $this->parseEuroAmount($total);
        $totalStr = 'EUR' . number_format($totalAmount, 2, '.', '');
        $s .= $this->text($totalStr, $this->pageWidth - $this->margin - 4, $this->y - 6, 11, 'HB', [0.83, 0.81, 0.52], 'right');
        $this->y = $boxY - 10;

        // Note
        if ($note) {
            $s .= $this->divider();
            $s .= $this->text('Hinweis: ' . $note, $this->margin, $this->y, 9, 'H', [0.4, 0.4, 0.4]);
            $this->y -= 14;
        }

        // Footer
        $this->y = max($this->y - 10, 60);
        $s .= $this->divider();
        $s .= $this->text('10% App-Rabatt: Code APP10 in der Leo Sushi App einloesen!', $this->pageWidth / 2, $this->y, 8, 'HB', [0.83, 0.81, 0.52], 'center');
        $this->y -= 12;
        $s .= $this->text('App Download: www.leo-sushi-berlin.de/download-app', $this->pageWidth / 2, $this->y, 7.5, 'H', [0.5, 0.5, 0.5], 'center');
        $this->y -= 12;
        $s .= $this->text('Vielen Dank fuer Ihren Besuch! · www.leo-sushi-berlin.de', $this->pageWidth / 2, $this->y, 7.5, 'H', [0.6, 0.6, 0.6], 'center');

        // ---- Assemble PDF objects ----
        return $this->assemblePdf($s);
    }

    // ---- Drawing helpers ----

    private function text(string $str, float $x, float $y, float $size, string $font, array $rgb, string $align = 'left'): string {
        $fontKey = $this->fontKey($font);
        if (!isset($this->fonts[$fontKey])) {
            $this->fonts[$fontKey] = count($this->fonts) + 1;
        }
        $fIdx = $this->fonts[$fontKey];

        $str = $this->escapePdf($str);

        // Approximate text width for alignment (Helvetica avg ~0.45 * size per char)
        if ($align === 'center' || $align === 'right') {
            $w = strlen($str) * $size * 0.42;
            if ($align === 'center') $x -= $w / 2;
            else $x -= $w;
        }

        $r = $rgb[0]; $g = $rgb[1]; $b = $rgb[2];
        return sprintf("BT\n%.3f %.3f %.3f rg\n/F%d %.1f Tf\n%.2f %.2f Td\n(%s) Tj\nET\n", $r, $g, $b, $fIdx, $size, $x, $y, $str);
    }

    private function rect(float $x, float $y, float $w, float $h, array $rgb): string {
        return sprintf("%.3f %.3f %.3f rg\n%.2f %.2f %.2f %.2f re f\n", $rgb[0], $rgb[1], $rgb[2], $x, $y, $w, $h);
    }

    private function line(float $x1, float $y1, float $x2, float $y2, array $rgb = [0.8, 0.8, 0.8], float $lw = 0.5): string {
        return sprintf("%.3f %.3f %.3f RG\n%.1f w\n%.2f %.2f m %.2f %.2f l S\n", $rgb[0], $rgb[1], $rgb[2], $lw, $x1, $y1, $x2, $y2);
    }

    private function divider(): string {
        $this->y -= 6;
        $out = $this->line($this->margin, $this->y, $this->pageWidth - $this->margin, $this->y, [0.83, 0.81, 0.52], 0.3);
        $this->y -= 8;
        return $out;
    }

    private function sectionTitle(string $title): string {
        $out = $this->text($title, $this->margin, $this->y, 7.5, 'HB', [0.5, 0.5, 0.5]);
        $this->y -= 14;
        return $out;
    }

    private function infoRow(string $label, string $value, bool $multiLine = false): string {
        $out = $this->text($label, $this->margin, $this->y, 8.5, 'H', [0.55, 0.55, 0.55]);
        $valueX = $this->margin + $this->contentWidth * 0.42;
        $out .= $this->text($value, $valueX, $this->y, 8.5, 'HB', [0.15, 0.15, 0.15]);
        $this->y -= 13;
        return $out;
    }

    private function tableHeader(array $cols, array $xPositions): string {
        $out = $this->rect($this->margin, $this->y - 12, $this->contentWidth, 14, [0.93, 0.93, 0.93]);
        foreach ($cols as $i => $col) {
            $align = $i > 0 ? 'right' : 'left';
            $x = $i < count($xPositions) - 1 ? $xPositions[$i] + 4 : $xPositions[$i] - 4;
            $out .= $this->text($col, $x, $this->y - 5, 7.5, 'HB', [0.4, 0.4, 0.4], $i === 0 ? 'left' : 'right');
        }
        $this->y -= 16;
        return $out;
    }

    private function tableRow(string $name, string $qty, string $unit, string $total, array $xPositions): string {
        $out = $this->text($name, $xPositions[0] + 4, $this->y, 8.5, 'H', [0.15, 0.15, 0.15]);
        $out .= $this->text($qty,   $xPositions[1] + 4, $this->y, 8.5, 'H', [0.3, 0.3, 0.3], 'right');
        $out .= $this->text($unit,  $xPositions[2] + 4, $this->y, 8.5, 'H', [0.3, 0.3, 0.3], 'right');
        $out .= $this->text($total, $xPositions[3] - 4,  $this->y, 8.5, 'HB', [0.15, 0.15, 0.15], 'right');
        $this->y -= 13;
        return $out;
    }

    private function totalRow(string $label, string $value): string {
        $out = $this->text($label, $this->pageWidth - $this->margin - 120, $this->y, 9, 'H', [0.4, 0.4, 0.4]);
        $out .= $this->text($value, $this->pageWidth - $this->margin - 4, $this->y, 9, 'H', [0.15, 0.15, 0.15], 'right');
        $this->y -= 13;
        return $out;
    }

    private function fontKey(string $font): string {
        // H = Helvetica, HB = Helvetica-Bold, C = Courier
        $map = ['H' => 'Helvetica', 'HB' => 'Helvetica-Bold', 'C' => 'Courier'];
        return $map[$font] ?? 'Helvetica';
    }

    private function escapePdf(string $s): string {
        // Replace special PDF characters
        $s = str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $s ?? '');
        // Replace EUR symbol with 'EUR ' for Type1 fonts
        $s = str_replace('EUR', 'EUR ', $s);
        // Remove other non-ASCII safely
        $s = preg_replace('/[^\x20-\x7E]/', '', $s);
        return $s;
    }

    private function parseEuroAmount($amount) {
        if (is_numeric($amount)) {
            return floatval($amount);
        }
        $str = str_replace(['€', ' ', 'EUR'], '', (string)($amount ?? ''));
        if (strpos($str, ',') !== false && strpos($str, '.') !== false) {
            $str = str_replace('.', '', $str);
            $str = str_replace(',', '.', $str);
        } elseif (strpos($str, ',') !== false) {
            $str = str_replace(',', '.', $str);
        }
        return floatval($str);
    }

    // ---- PDF Assembly ----

    private function addObj(string $content): int {
        $this->objCount++;
        $this->objects[$this->objCount] = $content;
        return $this->objCount;
    }

    private function assemblePdf(string $pageStream): string {
        $this->objCount = 0;
        $this->objects  = [];

        // Font resources dict
        $fontResources = '';
        foreach ($this->fonts as $fontName => $fIdx) {
            $fontResources .= "/F{$fIdx} " . ($this->objCount + count($this->fonts) + 4) . " 0 R\n";
        }

        // Content stream object (will be obj 4)
        $streamContent = $pageStream;
        $streamLen = strlen($streamContent);

        // Obj 1: Catalog
        $this->addObj("<< /Type /Catalog /Pages 2 0 R >>");
        // Obj 2: Pages
        $this->addObj("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
        // Obj 3: Page
        $pw = $this->pageWidth;
        $ph = $this->pageHeight;
        $fontDictStr = '';
        foreach ($this->fonts as $fontName => $fIdx) {
            $fontDictStr .= "/F{$fIdx} " . (4 + $fIdx) . " 0 R ";
        }
        $this->addObj("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {$pw} {$ph}] /Contents 4 0 R /Resources << /Font << {$fontDictStr}>> >> >>");
        // Obj 4: Content stream
        $this->addObj("<< /Length {$streamLen} >>\nstream\n{$streamContent}\nendstream");

        // Font objects (5+)
        foreach ($this->fonts as $fontName => $fIdx) {
            $this->addObj("<< /Type /Font /Subtype /Type1 /BaseFont /{$fontName} /Encoding /WinAnsiEncoding >>");
        }

        // Build PDF
        $pdf = "%PDF-1.4\n";
        $offsets = [];

        foreach ($this->objects as $num => $content) {
            $offsets[$num] = strlen($pdf);
            $pdf .= "{$num} 0 obj\n{$content}\nendobj\n";
        }

        // Cross-reference table
        $xrefStart = strlen($pdf);
        $total = $this->objCount + 1;
        $pdf .= "xref\n0 {$total}\n";
        $pdf .= sprintf("%010d %05d f \n", 0, 65535);
        foreach ($offsets as $offset) {
            $pdf .= sprintf("%010d %05d n \n", $offset, 0);
        }

        // Trailer
        $pdf .= "trailer\n<< /Size {$total} /Root 1 0 R >>\n";
        $pdf .= "startxref\n{$xrefStart}\n%%EOF\n";

        return $pdf;
    }
}
