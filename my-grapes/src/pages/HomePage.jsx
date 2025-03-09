import { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { PrimeIcons } from 'primereact/api';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Divider } from 'primereact/divider';
import { ScrollTop } from 'primereact/scrolltop';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function HomePage() {
  const [visibleDemo, setVisibleDemo] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [visibleContact, setVisibleContact] = useState(false);
  const toast = useRef(null);
  
  const generateContent = async () => {
    if (!aiPrompt.trim()) {
      toast.current.show({
        severity: 'warn',
        summary: 'Attention',
        detail: 'Veuillez décrire votre site web',
        life: 3000
      });
      return;
    }
    
    setIsGenerating(true);
    // Simulation d'appel API IA
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsGenerating(false);
    
    toast.current.show({
      severity: 'success',
      summary: 'Succès',
      detail: 'Contenu généré avec succès',
      life: 3000
    });
  };

  const templateCards = [
    { name: 'Portfolio', description: 'Idéal pour présenter vos travaux créatifs', color: 'bg-blue-100' },
    { name: 'E-commerce', description: 'Solution complète pour vendre en ligne', color: 'bg-green-100' },
    { name: 'Blog', description: 'Partagez vos idées avec style', color: 'bg-purple-100' }
  ];

  const features = [
    { title: 'Design Automatisé', icon: PrimeIcons.PALETTE, text: "L'IA adapte votre design en temps réel", color: 'bg-blue-500' },
    { title: 'Contenu Optimisé', icon: PrimeIcons.COMMENT, text: 'Génération automatique de textes SEO', color: 'bg-indigo-500' },
    { title: 'Accessibilité', icon: PrimeIcons.EYE, text: 'Vérification automatique des standards WCAG', color: 'bg-purple-500' },
    { title: 'Templates Réactifs', icon: PrimeIcons.MOBILE, text: 'Optimisés pour tous les appareils', color: 'bg-teal-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Toast ref={toast} position="top-right" />
      <Navbar />
      
      {/* Hero Section - Design amélioré */}
      <header className="py-20 md:py-28 bg-gradient-to-br from-blue-800 via-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute top-1/4 right-10 w-60 h-60 bg-white rounded-full"></div>
          <div className="absolute bottom-10 left-1/3 w-20 h-20 bg-white rounded-full"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-6 animate-fade-in tracking-tight">
            Créez votre site web <span className="text-yellow-300">sans coder</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto font-light">
            Construisez un site professionnel en quelques minutes avec notre 
            <span className="px-2 mx-1 bg-blue-700 bg-opacity-40 rounded-md font-medium">éditeur visuel</span> 
            et l'IA générative.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <Button 
              label="Commencer gratuitement" 
              icon={PrimeIcons.ARROW_RIGHT}
              iconPos="right"
              className="p-button-raised p-button-rounded bg-yellow-400 hover:bg-yellow-500 text-gray-800 border-none px-6 py-3 text-lg"
            />
            <Button 
              label="Voir la démo" 
              icon={PrimeIcons.PLAY}
              className="p-button-raised p-button-rounded border-white text-white hover:bg-white hover:text-blue-600 px-6 py-3 text-lg" 
              onClick={() => setVisibleDemo(true)}
            />
          </div>
          
          {/* Aperçu de l'interface avec l'IA */}
          <div className="bg-white rounded-2xl shadow-2xl mx-auto max-w-4xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center bg-gray-50 px-6 py-3 border-b border-gray-100">
              <div className="flex gap-2 mr-4">
                <span className="w-3 h-3 rounded-full bg-red-500"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
              </div>
              <div className="flex-1 text-center text-gray-500 text-sm">WebBuilder AI</div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                  <i className={`${PrimeIcons.STAR} mr-1`}></i> AI Suggestion
                </span>
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                  <i className={`${PrimeIcons.PALETTE} mr-1`}></i> Design Assist
                </span>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                  <i className={`${PrimeIcons.BOLT} mr-1`}></i> SEO Optimizer
                </span>
              </div>
              <img 
                src="/ai.png" 
                alt="Preview éditeur" 
                className="rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow w-full"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Section Fonctionnalités IA - Design amélioré */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-sm uppercase font-semibold tracking-wider">Intelligence artificielle</span>
            <h2 className="text-4xl font-bold mt-4 mb-2">Notre IA créative vous assiste</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Une technologie puissante qui comprend vos besoins et crée le site parfait</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 transform hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-2">
                  <i className={PrimeIcons.COMMENT}></i>
                </span>
                Générez votre site en langage naturel
              </h3>
              <div className="flex gap-4 mb-6">
                <InputText
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Décrivez votre site (ex: 'Site e-commerce pour bijoux artisanaux')"
                  className="w-full p-3 rounded-lg shadow-sm"
                />
                <Button 
                  icon={PrimeIcons.MAGIC}
                  tooltip="Générer"
                  tooltipOptions={{ position: 'top' }}
                  loading={isGenerating}
                  onClick={generateContent}
                  className="p-button-rounded p-button-primary shadow-md"
                />
              </div>
              
              {isGenerating ? (
                <div className="text-center py-10 bg-blue-50 rounded-lg">
                  <ProgressSpinner style={{ width: '50px', height: '50px' }} className="mb-4" />
                  <p className="text-blue-600 font-medium">L'IA analyse votre demande et génère votre structure de site...</p>
                </div>
              ) : (
                <div className="ai-output bg-blue-50 rounded-lg p-6 min-h-40">
                  <h3 className="font-semibold mb-4 text-blue-800">Suggestions de l'IA :</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-blue-200 p-2 rounded-full mr-3">
                        <i className={`${PrimeIcons.SITEMAP} text-blue-600`}></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Structure de navigation</h4>
                        <p className="text-sm text-gray-600">Menu optimisé pour le parcours utilisateur</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-purple-200 p-2 rounded-full mr-3">
                        <i className={`${PrimeIcons.PALETTE} text-purple-600`}></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Palette de couleurs</h4>
                        <div className="flex gap-2 mt-1">
                          {['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-gray-200', 'bg-gray-800'].map((color, idx) => (
                            <div key={idx} className={`w-6 h-6 rounded-full ${color} border border-gray-200`}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-green-200 p-2 rounded-full mr-3">
                        <i className={`${PrimeIcons.TH_LARGE} text-green-600`}></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Sections recommandées</h4>
                        <p className="text-sm text-gray-600">Hero, À propos, Catalogue, Témoignages, Contact</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="p-0 border-none shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="flex items-center p-6">
                    <Avatar icon={feature.icon} className={`${feature.color} text-white mr-4`} size="large" shape="circle" />
                    <div>
                      <h3 className="text-xl font-semibold">{feature.title}</h3>
                      <p className="text-gray-600">{feature.text}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Comment ça marche */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-purple-100 text-purple-600 px-4 py-1 rounded-full text-sm uppercase font-semibold tracking-wider">
              Simplicité
            </span>
            <h2 className="text-4xl font-bold mt-4 mb-2">Comment ça marche ?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Trois étapes simples pour créer le site de vos rêves</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Décrivez votre projet',
                text: 'Expliquez à notre IA ce que vous souhaitez créer',
                icon: PrimeIcons.PENCIL,
                color: 'bg-blue-500'
              },
              {
                step: '02',
                title: 'Personnalisez',
                text: 'Ajustez les éléments générés selon vos préférences',
                icon: PrimeIcons.COG,
                color: 'bg-purple-500'
              },
              {
                step: '03',
                title: 'Publiez',
                text: 'Mettez votre site en ligne en un clic',
                icon: PrimeIcons.CLOUD_UPLOAD,
                color: 'bg-green-500'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg relative overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center opacity-10 text-4xl font-bold">
                  {item.step}
                </div>
                <div className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6`}>
                  <i className={item.icon}></i>
                </div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Création Rapide */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-yellow-100 text-yellow-600 px-4 py-1 rounded-full text-sm uppercase font-semibold tracking-wider">
              Templates
            </span>
            <h2 className="text-4xl font-bold mt-4 mb-2">Commencez en 1 minute</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choisissez parmi nos modèles professionnels et personnalisez-les en temps réel
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {templateCards.map((template, index) => (
              <div key={index} className={`${template.color} rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-2`}>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={`/templates/${template.name.toLowerCase()}.jpg`} 
                    alt={template.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black opacity-20 group-hover:opacity-0 transition-opacity"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{template.name}</h3>
                  <p className="text-gray-700 mb-4">{template.description}</p>
                  <div className="flex justify-between items-center">
                    <Button 
                      label="Personnaliser" 
                      className="p-button-text p-button-sm"
                      icon={PrimeIcons.PENCIL}
                    />
                    <Button
                      icon={PrimeIcons.EYE}
                      className="p-button-rounded p-button-text p-button-sm"
                      tooltip="Aperçu"
                      tooltipOptions={{ position: 'top' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button 
              label="Explorer tous les modèles" 
              className="p-button-outlined p-button-rounded px-6 py-2"
              icon={PrimeIcons.SEARCH}
            />
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm uppercase font-semibold tracking-wider">
              Témoignages
            </span>
            <h2 className="text-4xl font-bold mt-4 mb-2">Ce que disent nos clients</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Des milliers d'entrepreneurs ont déjà créé leur site avec notre outil</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Marie Dupont',
                role: 'Photographe',
                text: "En tant que photographe, j'avais besoin d'un site qui mette en valeur mon travail. L'IA a parfaitement compris mes besoins.",
                rating: 5
              },
              {
                name: 'Thomas Martin',
                role: 'Restaurateur',
                text: "J'ai créé mon site de restaurant en moins d'une heure ! Le résultat est professionnel et mes clients adorent.",
                rating: 5
              },
              {
                name: 'Sophie Leroy',
                role: 'Coach sportif',
                text: "Interface intuitive et design moderne. J'ai pu facilement intégrer mes vidéos et système de réservation.",
                rating: 4
              }
            ].map((testimonial, idx) => (
              <Card key={idx} className="border-none shadow-lg hover:shadow-xl transition-all p-0">
                <div className="p-6">
                  <div className="flex text-yellow-500 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={i < testimonial.rating ? PrimeIcons.STAR_FILL : PrimeIcons.STAR}></i>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <Avatar 
                      image={`/avatars/avatar-${idx+1}.jpg`} 
                      shape="circle" 
                      className="mr-3"
                    />
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à créer votre site sans effort ?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont déjà transformé leurs idées en sites web professionnels
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              label="Commencer gratuitement" 
              icon={PrimeIcons.ARROW_RIGHT}
              iconPos="right"
              className="p-button-raised p-button-rounded bg-white text-indigo-600 border-none hover:bg-gray-100 px-6 py-3 text-lg"
            />
            <Button 
              label="Contactez-nous" 
              className="p-button-outlined p-button-rounded border-white text-white hover:bg-white hover:text-indigo-600 px-6 py-3 text-lg"
              onClick={() => setVisibleContact(true)}
            />
          </div>
        </div>
      </section>

      {/* Dialogs */}
      <Dialog 
        visible={visibleDemo} 
        onHide={() => setVisibleDemo(false)} 
        className="w-full max-w-4xl"
        header="Comment ça marche ?"
        dismissableMask
        modal
      >
        <div className="bg-gray-100 rounded-lg p-4 mb-4">
          <div className="flex items-center text-gray-600 mb-2">
            <i className={`${PrimeIcons.INFO_CIRCLE} mr-2`}></i>
            <span className="font-medium">Découvrez notre outil en action</span>
          </div>
          <p className="text-sm text-gray-600">Cette vidéo vous montre comment créer un site professionnel en quelques minutes.</p>
        </div>
        
        <div className="rounded-lg overflow-hidden shadow-lg">
          <video controls className="w-full h-auto">
            <source src="/demo-video.mp4" type="video/mp4" />
          </video>
        </div>
      </Dialog>

      <Dialog
        visible={visibleContact}
        onHide={() => setVisibleContact(false)}
        className="w-full max-w-md"
        header="Démarrer votre projet"
        dismissableMask
        modal
        footer={
          <div className="flex justify-end">
            <Button 
              label="Envoyer" 
              icon={PrimeIcons.SEND} 
              className="p-button-raised bg-indigo-600 hover:bg-indigo-700"
            />
          </div>
        }
      >
        <div className="grid gap-4 py-4">
          <div className="p-field">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <InputText id="name" className="w-full" />
          </div>
          <div className="p-field">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email professionnel</label>
            <InputText id="email" className="w-full" />
          </div>
          <div className="p-field">
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">Description du projet</label>
            <InputText id="project" className="w-full" />
          </div>
          <div className="mt-2">
            <div className="flex items-center">
              <input id="newsletter" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-600">
                Recevoir notre newsletter avec des conseils pour optimiser votre site
              </label>
            </div>
          </div>
        </div>
      </Dialog>

      <Footer />
      
      {/* Bouton d'action flottant */}
      <div className="fixed bottom-17 right-5 z-50">
        <Button 
          label=""
          icon={PrimeIcons.COMMENTS}
          className="p-button-rounded p-button-raised shadow-xl bg-indigo-600 hover:bg-indigo-700" 
          onClick={() => setVisibleContact(true)}
        />
      </div>
      
      {/* Scroll to top */}
      <ScrollTop threshold={300} />
    </div>
  );
}