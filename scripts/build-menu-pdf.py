"""Build menu PDF + QR code for restaurant-grec."""
from reportlab.lib.pagesizes import A5
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import qrcode
import os

OUT_PDF = "C:/Users/User/Desktop/CODE ENTREPRISES/restaurant-grec/public/menu.pdf"
OUT_QR  = "C:/Users/User/Desktop/CODE ENTREPRISES/restaurant-grec/public/menu-qr.png"
URL_MENU = "https://restaurant-grec.pages.dev/el/#carte"

GOLD = HexColor("#E5B32A")
DARK = HexColor("#0a0a0a")
GREY = HexColor("#888888")
WHITE = HexColor("#ffffff")

MENU = {
    "cover": {
        "title_el": "Το Καλαμάκι\nΤης Τρούμπας",
        "title_en": "To Kalamaki Tis Troumpas",
        "sub": "Μπουμπουλίνας 8 & Νοταρά — Πειραιάς",
        "phone": "+30 210 422 2233",
        "hours": "Δευ–Πέμ 11:00–03:00 · Παρ–Σαβ 11:00–06:00 · Κυρ Κλειστό",
    },
    "sections": [
        {
            "title_el": "Ορεκτικά",
            "title_en": "Appetizers",
            "items": [
                ("Κολοκυθοκεφτέδες τμχ", "Zucchini Fritter pc", "1,20€"),
                ("Κολοκυθοκεφτέδες μερίδα 5 τμχ", "Zucchini Fritters 5 pcs", "6,00€"),
                ("Ρεβυθοκεφτέδες τμχ", "Chickpea Fritter pc", "1,20€"),
                ("Ρεβυθοκεφτέδες μερίδα 5 τμχ", "Chickpea Fritters 5 pcs", "6,00€"),
                ("Πίτα στα κάρβουνα", "Grilled pita bread", "0,60€"),
                ("Φρέσκιες Πατάτες", "Fresh Fried Potatoes", "3,50€"),
                ("Φρέσκιες Πατάτες με τυρί", "with cheese", "4,00€"),
                ("Φρέσκιες Πατάτες με τσένταρ & μπέικον", "with cheddar cheese & bacon", "4,50€"),
                ("Φέτα", "Feta cheese", "3,50€"),
                ("Φέτα ψητή με ντομάτα & πιπεριά", "Roasted Feta with tomato & peppers", "4,50€"),
                ("Τζατζίκι σπιτικό", "Tzatziki (homemade)", "3,50€"),
                ("Τυροκαυτερή", "Hot Pepper Cheese", "3,50€"),
            ],
        },
        {
            "title_el": "Σαλάτες",
            "title_en": "Salads",
            "items": [
                ("Λάχανο-Καρότο", "Cabbage-Carrot Salad", "4,50€"),
                ("Μαρούλι", "Lettuce Salad (lettuce, fresh onion, dill)", "4,50€"),
                ("Ντάκος", "Dakos (crete rusk, tomato, feta, olives, capers)", "6,50€"),
                ("Η σαλάτα της Τρούμπας", "Trouba's salad", "7,50€"),
            ],
        },
        {
            "title_el": "Πίτες τυλιχτές",
            "title_en": "Wrapped Pita",
            "items": [
                ("Καλαμάκι χοιρινό", "Skewered pork (tomato, onion, tzatziki, fries)", "3,50€"),
                ("Καλαμάκι κοτόπουλο μπούτι", "Skewered chicken thigh (tomato, lettuce, sauce, fries)", "3,50€"),
                ("Καλαμάκι κοτομπέικον", "Skewered chicken with bacon (tomato, lettuce, sauce, fries)", "3,80€"),
                ("Μπιφτέκι μοσχαρίσιο", "Beef Burger pc (tomato, onion, tzatziki, fries)", "3,50€"),
            ],
        },
        {
            "title_el": "Μερίδες",
            "title_en": "Portions",
            "items": [
                ("Καλαμάκι χοιρινό (4 τμχ)", "Skewered pork (4 pcs) — fries, pita, tomato, onion, tzatziki", "9,00€"),
                ("Καλαμάκι κοτόπουλο μπούτι (4 τμχ)", "Skewered chicken thigh (4 pcs) — fries, pita, salad", "9,00€"),
                ("Καλαμάκι κοτομπέικον (4 τμχ)", "Skewered chicken with bacon (4 pcs) — fries, pita, salad", "9,50€"),
            ],
        },
        {
            "title_el": "Χάμπουργκερ & Veggie",
            "title_en": "Burger & Veggie",
            "items": [
                ("Χάμπουργκερ", "Beef burger — cheddar, lettuce, tomato, onion", "7,00€"),
                ("+ Έξτρα μπέικον", "extra bacon", "+0,70€"),
                ("Μπιφτέκι λαχανικών τμχ", "Vegetable Stick pc", "2,00€"),
                ("Τυλιχτό Μπιφτέκι Λαχανικών", "Wrapped Vegetable Burger", "3,50€"),
                ("Τυλιχτό Ρεβυθοκεφτές", "Wrapped Chickpea Fritter", "3,50€"),
                ("Τυλιχτό Οικολογικό", "Wrapped pita without meat", "2,50€"),
                ("Veggie Burger", "with cheese, ketchup, mustard, fries", "7,00€"),
            ],
        },
    ],
}

# Greek-supporting font (Noto Sans or similar). Fallback to Helvetica if not found.
GREEK_FONT = "Helvetica"
GREEK_BOLD = "Helvetica-Bold"
# Try to use a Greek-supporting font from Windows
for f in [
    "C:/Windows/Fonts/segoeui.ttf",
    "C:/Windows/Fonts/arial.ttf",
]:
    if os.path.exists(f):
        try:
            pdfmetrics.registerFont(TTFont("GreekSans", f))
            GREEK_FONT = "GreekSans"
            bold_f = f.replace(".ttf", "b.ttf") if "segoe" in f else f.replace("arial", "arialbd")
            if os.path.exists(bold_f):
                pdfmetrics.registerFont(TTFont("GreekSansBold", bold_f))
                GREEK_BOLD = "GreekSansBold"
            else:
                GREEK_BOLD = GREEK_FONT
            break
        except Exception as e:
            print("Font load failed:", e)

W, H = A5  # 148 x 210 mm
PAD = 1.2 * cm

def page_cover(c):
    c.setFillColor(DARK)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    # Gold border
    c.setStrokeColor(GOLD)
    c.setLineWidth(1)
    c.rect(0.7*cm, 0.7*cm, W - 1.4*cm, H - 1.4*cm, stroke=1, fill=0)
    # Title
    c.setFillColor(WHITE)
    c.setFont(GREEK_BOLD, 22)
    lines = MENU["cover"]["title_el"].split("\n")
    y = H - 5*cm
    for line in lines:
        c.drawCentredString(W/2, y, line)
        y -= 0.9*cm
    c.setFont(GREEK_FONT, 11)
    c.setFillColor(GOLD)
    c.drawCentredString(W/2, y - 0.3*cm, MENU["cover"]["title_en"])
    # Diamond divider
    c.setFont(GREEK_FONT, 14)
    c.drawCentredString(W/2, y - 1.5*cm, "◆ · · · ◆")
    # Info
    c.setFillColor(WHITE)
    c.setFont(GREEK_FONT, 9)
    c.drawCentredString(W/2, 5*cm, MENU["cover"]["sub"])
    c.drawCentredString(W/2, 4.5*cm, MENU["cover"]["phone"])
    c.setFillColor(GREY)
    c.setFont(GREEK_FONT, 7)
    c.drawCentredString(W/2, 3.8*cm, MENU["cover"]["hours"])
    # Footer
    c.setFont(GREEK_FONT, 6)
    c.setFillColor(HexColor("#444444"))
    c.drawCentredString(W/2, 1.2*cm, "restaurant-grec.pages.dev")

def page_section(c, section):
    c.setFillColor(DARK)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    # Header
    c.setFillColor(GOLD)
    c.setFont(GREEK_BOLD, 16)
    c.drawCentredString(W/2, H - 2*cm, section["title_el"])
    c.setFillColor(WHITE)
    c.setFont(GREEK_FONT, 10)
    c.drawCentredString(W/2, H - 2.5*cm, section["title_en"])
    # Divider
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.5)
    c.line(3*cm, H - 2.9*cm, W - 3*cm, H - 2.9*cm)
    # Items
    y = H - 3.6*cm
    for name_el, name_en, price in section["items"]:
        if y < 2*cm:
            break
        c.setFillColor(WHITE)
        c.setFont(GREEK_BOLD, 9)
        # Greek name (left)
        c.drawString(PAD, y, name_el)
        # Price (right)
        c.setFillColor(GOLD)
        c.setFont(GREEK_BOLD, 9.5)
        c.drawRightString(W - PAD, y, price)
        # English description (below, grey)
        c.setFillColor(GREY)
        c.setFont(GREEK_FONT, 7)
        c.drawString(PAD, y - 0.35*cm, name_en)
        # Separator line
        c.setStrokeColor(HexColor("#1a1a1a"))
        c.setLineWidth(0.3)
        c.line(PAD, y - 0.7*cm, W - PAD, y - 0.7*cm)
        y -= 1.1*cm
    # Footer
    c.setFillColor(HexColor("#444444"))
    c.setFont(GREEK_FONT, 6)
    c.drawCentredString(W/2, 1.2*cm, "restaurant-grec.pages.dev")

def build_pdf():
    c = canvas.Canvas(OUT_PDF, pagesize=A5)
    page_cover(c)
    c.showPage()
    for s in MENU["sections"]:
        page_section(c, s)
        c.showPage()
    c.save()
    print("PDF:", OUT_PDF)

def build_qr():
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=12,
        border=2,
    )
    qr.add_data(URL_MENU)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0a0a0a", back_color="white")
    img.save(OUT_QR)
    print("QR:", OUT_QR)

if __name__ == "__main__":
    build_pdf()
    build_qr()
