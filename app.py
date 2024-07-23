from flask import Flask, render_template, request, jsonify
import re

app = Flask(__name__)

# Pairs of patterns and responses
pairs = [
    [r'hi|hello|hey', ['Halo! Bagaimana saya bisa membantu Anda mengenai BPS hari ini?', 'Hai! Ada yang bisa saya bantu terkait BPS?']],
    [r'Dimana Lokasi BPS Boyolali', ['Lokasi BPS Boyolali berada di Jl. Merapi No. 6, Boyolali.']],
    [r'Apa saja tugas dan fungsi BPS Boyolali?', ['Tugas dan fungsi BPS Boyolali antara lain mengumpulkan, menganalisis, dan menyajikan data statistik untuk keperluan pemerintah dan masyarakat.']],
    [r'Bagaimana cara mendapatkan data statistik dari BPS Boyolali?', ['Anda dapat mengakses data statistik dari BPS Boyolali melalui situs web mereka atau langsung mengunjungi kantor BPS Boyolali.']],
    [r'Apa saja program unggulan BPS Boyolali?', ['Program unggulan BPS Boyolali meliputi sensus penduduk, survei sosial ekonomi, dan pendataan potensi desa.']],
    [r'Berapa Angka Inflasi Boyolali?', ['Angka inflasi Boyolali saat ini adalah sekitar 3.5% per tahun, berdasarkan data terakhir yang tersedia.']],
    [r'bye|goodbye', ['Selamat tinggal! Semoga harimu menyenangkan!', 'Sampai jumpa!']]
]

def chatbot_response(text):
    for pattern, responses in pairs:
        if re.search(pattern, text, re.IGNORECASE):
            return responses[0]
    return "Maaf, saya tidak mengerti pertanyaan Anda."

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/get", methods=["GET", "POST"])
def chatbot():
    userText = request.args.get('msg')
    return jsonify({"response": chatbot_response(userText)})

if __name__ == "__main__":
    app.run(debug=True)
