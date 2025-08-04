using AutoMapper;
using ResumeAutomation.API.DTOs;
using ResumeAutomation.API.Models;

namespace ResumeAutomation.API.Mapping;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        // Candidate mappings
        CreateMap<Candidate, CandidateDto>();
        CreateMap<CreateCandidateDto, Candidate>();
        CreateMap<UpdateCandidateDto, Candidate>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // Document mappings
        CreateMap<Document, DocumentDto>();
        CreateMap<CreateDocumentDto, Document>();
        CreateMap<UpdateDocumentDto, Document>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        // DocumentVersion mappings
        CreateMap<DocumentVersion, DocumentVersionDto>();

        // Application mappings
        CreateMap<Application, ApplicationDto>();
        CreateMap<CreateApplicationDto, Application>();
        CreateMap<UpdateApplicationDto, Application>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
    }
} 